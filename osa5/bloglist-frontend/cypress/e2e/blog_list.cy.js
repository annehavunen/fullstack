describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test Testersson',
      username: 'test',
      password: 'topsecret'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('topsecret')
      cy.get('#login-button').click()
      cy.contains('Test Testersson logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.notification').contains('wrong username or password')
      cy.get('html').should('not.contain', 'Test Testersson logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('test')
      cy.get('#password').type('topsecret')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('input[placeholder="blog title"]').type('a blog created by cypress')
      cy.get('input[placeholder="blog author"]').type('Test Author')
      cy.get('input[placeholder="blog url"]').type('http://testblog.com')
      cy.get('button[type="submit"]').click()
      cy.contains('a blog created by cypress')
    })
    
    describe('and several blogs exist', function () {
      beforeEach(function () {
        cy.get('button:contains("new blog")').click()
        cy.get('input[placeholder="blog title"]').type('Blog number one')
        cy.get('input[placeholder="blog author"]').type('Test Author')
        cy.get('input[placeholder="blog url"]').type('http://testblog.com')
        cy.get('button[type="submit"]').click()

        cy.get('button:contains("new blog")').click()
        cy.get('input[placeholder="blog title"]').type('Blog number two')
        cy.get('input[placeholder="blog author"]').type('Test Author')
        cy.get('input[placeholder="blog url"]').type('http://testblog.com')
        cy.get('button[type="submit"]').click()

      })

      it('one can be liked', function () {
        cy.wait(1000)
        cy.contains('Blog number one')
          .parent()
          .contains('view')
          .click()
        cy.contains('1').should('not.exist')
        cy.contains('like')
          .click()
        cy.contains('1')
      })

      it('one can be deleted', function () {
        cy.contains('Blog number one')
         .parent()
         .contains('view')
         .click()
        cy.contains('remove')
          .click()
        cy.contains('Blog number one').should('not.exist')
      })

      it('only the creator can see the delete button of a blog', function () {
        cy.contains('Blog number one')
          .parent()
          .contains('view')
          .click()
        cy.contains('remove')

        cy.contains('logout')
          .click()

        const user2 = {
          name: 'Second User',
          username: 'second',
          password: 'supersecret'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user2)

        cy.get('#username').type('second')
        cy.get('#password').type('supersecret')
        cy.get('#login-button').click()

        cy.contains('Blog number one')
          .parent()
          .contains('view')
          .click()
        cy.contains('remove').should('not.exist')
      })

      it('blogs are ordered according to the likes with the blog', function () {
        cy.wait(4500)

        cy.get('.blog').eq(0).should('contain', 'Blog number one')
        cy.get('.blog').eq(1).should('contain', 'Blog number two')

        cy.contains('Blog number two')
          .parent()
          .contains('view')
          .click()

        cy.get('.likeButton')
          .eq(1)
          .click()

        cy.get('.blog').eq(0).should('contain', 'Blog number two')
        cy.get('.blog').eq(1).should('contain', 'Blog number one')
      })
    })
  })
})

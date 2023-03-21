```mermaid
sequenceDiagram
    participant selain
    participant palvelin

    Note right of selain: JavaScript-koodi rekisteröi tapahtumankäsittelijän, luo muistiinpanon, lisää sen listalle, piirtää muistiinpanojen listan ja lähettää muistiinpanon palvelimelle

    selain->>palvelin: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate palvelin
    palvelin-->>selain: 201 created
    deactivate palvelin
```

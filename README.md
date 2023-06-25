# lovelace-energy-card
With this card are you able to view your energy consumption in Home Assistant

Add in your configuration.yaml in de recources part, following 2 lines:
    - url: /hacsfiles/lovelace-energy-card/lovelace-energy-card-v1.js
      type: module     

Create a card in a view as follows:

    type: custom:layout-card    
    layout_type: grid
    layout:
      grid-template-columns: 100%
    cards: 
      - type: custom:energy-card
        header: Energie overzicht
        style: !include /config/lovelace/css/css.energy-card.yaml
        export_entities:
          - entity: sensor.p1_active_power
            name: Slimmemeter
        import_entities: 
          - entity: sensor.meterkast_active_power
            name: Meterkast      
          - entity: sensor.cv_active_power
            name: CV-Ketel
          - entity: sensor.cvpomp_active_power
            name: CV-Pomp
          - entity: sensor.server_active_power
            name: Domotica
          - entity: sensor.laadpaal_active_power
            name: Laadpaal
          - entity: sensor.kantoor_active_power
            name: Kantoor
          - entity: sensor.vaatwasser_active_power
            name: Vaatwasser
          - entity: sensor.koelkast_active_power
            name: Koelkast
          - entity: sensor.oven_active_power
            name: Oven 
          - entity: sensor.koffiezetter_active_power
            name: Koffiezetter 
          - entity: sensor.boiler_active_power
            name: Boiler        
          - entity: sensor.was_active_power
            name: Wasmachine
          - entity: sensor.wasdroger_active_power
            name: Wasdroger 
          - entity: sensor.keukenswitch_power_consumption
            name: Switch

In the export_entities and the import_entities can be added multiple entities.
If you running Home Assistant in YAML-mode then you are able to include other files. Otherwise copy-paste the css in place of the line: style: !include /config/lovelace/css/css.energy-card.yaml
        

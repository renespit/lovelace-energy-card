# Thanks to: https://community.home-assistant.io/t/tutorials-how-to-develop-a-custom-card-and-ship-hacs-repositories/526566 

class EnergyCard extends HTMLElement {

    _config;
    _hass;
    _elements = {};
    _isAttached = false;
    _import_total = 0;
    _export_total = 0;
    
    constructor() {
        super();        
    }

    setConfig(config) {
        this._config = config;
        if (!this._isAttached) {
            this.doCard();
            this.doStyle();
            this.doAttach();
            this.doQueryElements();
            //this.doListen();
            this._isAttached = true;
        }
        this.doCheckConfig();
        this.doUpdateConfig();
    }

    set hass(hass) {
        this._hass = hass;
        this.doUpdateHass();
    }

    setEntityId(myEntity) {
        this._config.entity = myEntity;
    }

    getEntity(myEntity) {
        const entityId = myEntity.entity;
        const nameStr = myEntity.name;
        const state = this._hass.states[entityId];
        let stateStr = state ? state.state : 'unavailable';
        stateStr = parseFloat(stateStr);
        stateStr = stateStr.toFixed(1);

        return {
            'Name': nameStr,
            'State': stateStr
        };
    }

    getHeader() {
        return this._config.header;
    }

    getHTML(Name, State, HTML) {       
        const graphic_width = ((State/20) + 1).toFixed(0);       
        
        if (!State) {
            return HTML + "<tr><td class='pname'>" + Name + "</td><td class='vname'>Unavailable</td><td class='graphic'>&nbsp;</td></tr>";
        } else {
            return HTML + "<tr><td class='pname'>" + Name + "</td><td class='vname'>" + State + " W&nbsp;&nbsp</td><td class='graphic'><div class='graphic' style='max-width: " + graphic_width + "px; min-width: " + graphic_width + "px;'>&nbsp;</div></td></tr>";
        }
    }

    getHTMLListOfEntities(entities) {
        let HTML = "";
        for (let i = 0; i < entities.length; i++) {
            let {Name, State} = this.getEntity(entities[i]);
            HTML = this.getHTML(Name, State, HTML);
        }
        
        return HTML;
    }
    
    getTotalOfEntities(entities) {
        let TotalState = 0;
        for (let i = 0; i < entities.length; i++) {
            let {Name, State} = this.getEntity(entities[i]);
            TotalState = TotalState + ( State * 1 );
        }
        
        return TotalState.toFixed(1);
    }    

    doCheckConfig() {
        if (!this._config.export_entities) {
            throw new Error('Maak export entities aan. Er mogen er meer dan 1 zijn.');
        }
        if (!this._config.import_entities) {
            throw new Error('Maak import entities aan. Er mogen er meer dan 1 zijn.');
        }
    }

    doAttach() {
        this.append(this._elements.style, this._elements.card);
    }

    doStyle() {
        this._elements.style = document.createElement("style");
        this._elements.style.textContent = this._config.style;
    }

    doCard() {
        this._elements.card = document.createElement("ha-card");
        this._elements.card.innerHTML = "<div class='card-content'></div>";
    }

    doQueryElements() {
        const card = this._elements.card;
    }

    doListen() {
        this._elements.dl.addEventListener("click", this.onClicked.bind(this), false);
    }

    doUpdateConfig() {
        if (this.getHeader()) {
            this._elements.card.setAttribute("header", this.getHeader());
        } else {
            this._elements.card.removeAttribute("header");
        }
    }

    doUpdateHass() {
        this._import_total = this.getTotalOfEntities(this._config.import_entities);
        this._export_total = this.getTotalOfEntities(this._config.export_entities);
        const rest_total = (this._export_total - this._import_total).toFixed(1);
        
        let HTML = "<table cellspacing='0' cellpadding='0'>";
        HTML = HTML + this.getHTMLListOfEntities(this._config.import_entities);
        HTML = HTML + "<tr><td class='pname'>&nbsp;</td><td class='vname'>--------- +</td></tr>";
        HTML = HTML + "<tr><td class='pname'>&nbsp;</td><td class='vname'>" + this._import_total + " W&nbsp;&nbsp</td><td class='graphic'><div class='graphic' style='max-width: " + ((this._import_total/20) + 1).toFixed(0) + "px; min-width: " + ((this._import_total/20) + 1).toFixed(0) + "px;'>&nbsp;</div></td></tr>";
        HTML = HTML + "<tr><td class='pname'>&nbsp;</td><td class='vname'>&nbsp;</td></tr>";
        HTML = HTML + this.getHTMLListOfEntities(this._config.export_entities);
        HTML = HTML + "<tr><td class='pname'>&nbsp;</td><td class='vname'>--------- +</td></tr>";
        HTML = HTML + "<tr><td class='pname'>&nbsp;</td><td class='vname'>" + this._export_total + " W&nbsp;&nbsp</td><td class='graphic'><div class='graphic' style='max-width: " + ((this._export_total/20) + 1).toFixed(0) + "px; min-width: " + ((this._export_total/20) + 1).toFixed(0) + "px;'>&nbsp;</div></td></tr>";
        HTML = HTML + "<tr><td class='pname'>&nbsp;</td><td class='vname'>&nbsp;</td></tr>";
        HTML = HTML + "<tr><td class='pname'>&nbsp;</td><td class='vname'>" + this._export_total + " W&nbsp;&nbsp</td><td class='graphic'><div class='graphic' style='max-width: " + ((this._export_total/20) + 1).toFixed(0) + "px; min-width: " + ((this._export_total/20) + 1).toFixed(0) + "px;'>&nbsp;</div></td></tr>";
        HTML = HTML + "<tr><td class='pname'>&nbsp;</td><td class='vname'>" + this._import_total + " W&nbsp;&nbsp</td><td class='graphic'><div class='graphic' style='max-width: " + ((this._import_total/20) + 1).toFixed(0) + "px; min-width: " + ((this._import_total/20) + 1).toFixed(0) + "px;'>&nbsp;</div></td></tr>";
        HTML = HTML + "<tr><td class='pname'>&nbsp;</td><td class='vname'>--------- -</td></tr>";
        HTML = HTML + "<tr><td class='pname'>Resterende</td><td class='vname'>" + rest_total + " W&nbsp;&nbsp</td><td class='graphic'><div class='graphic' style='max-width: " + ((rest_total/20) + 1).toFixed(0) + "px; min-width: " + ((rest_total/20) + 1).toFixed(0) + "px;'>&nbsp;</div></td></tr>";
        HTML = HTML + "<tr><td class='pname'>&nbsp;</td><td class='vname'>&nbsp;</td></tr>";
        HTML = HTML + "</table>";
        //HTML = HTML + this._config.style;

        this._elements.card.innerHTML = HTML;
    }

}
;
customElements.define('energy-card', EnergyCard);

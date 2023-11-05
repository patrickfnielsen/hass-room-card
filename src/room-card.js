import { LitElement, html, css } from "lit-element"
import packageInfo from "../package.json"


class RoomCard extends LitElement {
    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
        return 2
    }

    // This will make parts of the card rerender when this.hass or this._config is changed.
    // this.hass is updated by Home Assistant whenever anything happens in your system
    static get properties() {
        return {
            hass: { attribute: false },
            _config: { state: true },
            _templateResults: { state: true },
            _unsubRenderTemplates: { state: true },
        }
    }

    // Our initial states
    constructor() {
        super()
        this._templateResults = {}
        this._unsubRenderTemplates = new Map()
    }

    // The render() function of a LitElement returns the HTML of your card, and any time one or the
    // properties defined above are updated, the correct parts of the rendered html are magically
    // replaced with the new values.  Check https://lit.dev for more info.
    render() {
        const secondary = this._getValue(this._config.secondary)
        return html`
            <ha-card @click=${this._handleAction}>
                <div class="container flex-column">
                    <div class="icon">
                        <ha-icon .icon=${this._config.icon} />
                    </div>

                    <div class="flex-column">
                        <span class="primary">${this._config.name}</span>
                        <span class="secondary">${secondary}</span>
                    </div>

                    <div class="states">
                    ${this._config.entities.map((item) => {
                        return this._getItemHTML(item)
                    })}
                    </div>
                </div>
            </ha-card>
        `
    }

    // Called by HAAS when config is changed
    setConfig(config) {
        this._tryDisconnect()

        if (!config.icon) {
            throw new Error("You need to define an Icon for the room")
        }

        if (!config.name) {
            throw new Error("You need to define a name for the room")
        }

        this._config = {
            navigate: "#",
            secondary: "{{}}",
            entities: [],
            ...config
        }
    }

    // Called by HAAS
    updated(changedProps) {
        super.updated(changedProps)
        if (!this._config || !this.hass) {
            return
        }

        this._tryConnect(this._config.secondary)
    }

    // Called by HAAS
    connectedCallback() {
        super.connectedCallback()
        this._tryConnect(this._config.secondary)
    }

    // Called by HAAS
    disconnectedCallback() {
        this._tryDisconnect()
    }

    // Get the state icon for an item
    _getItemHTML(item) {
        let stateValue = ""
        let stateIsOn = false
        if (item.type === "entity") {
            stateValue = this._getValue(item.entity)
            stateIsOn = stateValue == item.onState
        } else if (item.type == "template") {
            stateValue = this._getValue(item.condition)
            stateIsOn = stateValue != ""
        } else {
            return html`<span>invalid config</span>`
        }

        const icon = stateIsOn ? item.icon : item.iconOff ? item.iconOff : item.icon
        const iconClass = !stateIsOn ? 'off' : ''
        return html`<ha-icon class="${iconClass}" .icon=${icon} />`
    }

    // Check if an item is a template
    _isTemplate(item) {
        return item?.includes("{")
    }

    // Get the value, by checking if it's a template, otherwise assume it's
    // an entity and get it's state
    _getValue(item) {
        if (this._isTemplate(item)) {
            this._tryConnect(item)
        }

        return this._isTemplate(item)
            ? this._templateResults[item]?.result?.toString()
            : this.hass.states[item]?.state
    }

    // Handle navigation on click
    _handleAction() {
        this._fireEvent(this, "hass-action", {
            config: {
                tap_action: {
                    action: "navigate",
                    navigation_path: this._config.navigate,
                }
            },
            action: "tap"
        })
    }

    // Disconnect all template subscriptions
    async _tryDisconnect() {
        for (const item in this._templateResults) {
            this._tryDisconnectKey(item)
        }
    }

    async _tryDisconnectKey(item) {
        const unsubRenderTemplate = this._unsubRenderTemplates.get(item)
        if (!unsubRenderTemplate) {
            return
        }

        try {
            const unsub = await unsubRenderTemplate
            unsub()
            this._unsubRenderTemplates.delete(item)
        } catch (err) {
            if (err.code === "not_found" || err.code === "template_error") {
                // If we get here, the connection was probably already closed. Ignore.
            } else {
                throw err
            }
        }
    }

    // Try and subscribe to a template
    async _tryConnect(item) {    
        if (
            this._unsubRenderTemplates.get(item) !== undefined ||
            !this.hass ||
            !this._config ||
            !this._isTemplate(item)) {
            return
        }

        try {
            const sub = this._subscribeRenderTemplate(
                this.hass.connection,
                (result) => {
                    this._templateResults = {
                        ...this._templateResults,
                        [item]: result,
                    }
                },
                {
                    template: item ?? "",
                    variables: {
                        config: this._config,
                        user: this.hass.user?.name,
                    },
                    strict: true,
                }
            )

            this._unsubRenderTemplates.set(item, sub)
            await sub
        } catch(err) {
            this._unsubRenderTemplates.delete(item)
        }
    }

    async _subscribeRenderTemplate(conn, onChange, params) {
        return conn.subscribeMessage((msg) => onChange(msg), {
            type: "render_template",
            ...params,
        })
    }

    // Send a dom event
    _fireEvent(node, type, detail, options) {
        options = options || {}
        detail = detail === null || detail === undefined ? {} : detail
        const event = new Event(type, {
            bubbles: options.bubbles === undefined ? true : options.bubbles,
            cancelable: Boolean(options.cancelable),
            composed: options.composed === undefined ? true : options.composed,
        })
        event.detail = detail
        node.dispatchEvent(event)
        return event
    }

    static get styles() {
        return css`
            :host {
                --main-color: rgb(var(--rgb-grey));
                --icon-color: rgb(var(--rgb-white));
                --icon-size:  2rem;
                --state-icon-size: 1.35rem;
                --state-icon-color-off: #585858;
                --state-icon-color: white;
                --state-icon-padding: 2px;
                --card-primary-font-weight: 14px;
                --card-primary-font-weight: bold;
                --card-primary-line-height: 1.5;
                --card-secondary-font-weight: bolder;
                --card-secondary-font-size: 12px;
                --spacing: 0px;
            }
            
            ha-card:hover {
                cursor: pointer;
            }

            ha-icon {
                --mdc-icon-size: var(--icon-size);
                color: var(--icon-color);
            }

            .flex-column {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
            }

            .container {
                padding-bottom: 10px;
                padding-top: 15px;
            }

            .primary {
                font-weight: var(--card-primary-font-weight);
                font-size: var(--card-primary-font-size);
                line-height: var(--card-primary-line-height);
                color: var(--primary-text-color);
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }

            .secondary {
                font-weight: var(--card-secondary-font-weight);
                font-size: var(--card-secondary-font-size);
                line-height: var(--card-secondary-line-height);
                color: var(--secondary-text-color);
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }

            .icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: var(--icon-size);
                height: var(--icon-size);
                margin-bottom: 8px;
                margin-top: 4px;
            }

            .states {
                margin-top: 10px;
            }

            .states ha-icon {
                --mdc-icon-size: var(--state-icon-size);
                color: var(--state-icon-color);
                padding: var(--state-icon-padding);
            }

            .states ha-icon.off {
                color: var(--state-icon-color-off);
            }
        `;
    }
}

customElements.define("room-card", RoomCard);

console.log(
    `%c RoomCard %c ${packageInfo.version}`,
    "color: white; background: #039be5; font-weight: 700;",
    "color: #039be5; background: white; font-weight: 700;"
);
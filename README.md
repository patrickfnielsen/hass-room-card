# Room Card
[![hacs][hacs-badge]][hacs-url]
[![release][release-badge]][release-url]
![downloads][downloads-badge]
![build][build-badge]

**Theme: Home Assisant**

![Card - Default](https://github.com/patrickfnielsen/hass-room-card/blob/main/docs/images/theme-homeassistant.png?raw=true)

**Theme: Noctis**

![Cards - Noctis](https://github.com/patrickfnielsen/hass-room-card/blob/main/docs/images/theme-noctis.png?raw=true)


## What is Room Card
Room Card is designed to quickly show the state of a room, and when pressed it can navigate to a different page.

## Installation

### HACS
Room Card is available in [HACS][hacs] (Home Assistant Community Store).
1. Install HACS if you don't have it already
2. Open HACS in Home Assistant
3. Press the 3 dots in the top right, and select "Custom repositories"
4. For repository enter "https://github.com/patrickfnielsen/hass-room-card" and type select "Dashboard"
5. Click button with "+" icon
6. Search for "Room Card"

### Manual
1. Download `room-card.js` file from the [latest release][release-url].
2. Put `room-card.js` file into your `config/www` folder.
3. Add reference to `room-card.js` in Dashboard. There's two way to do that:
    - **Using UI:** _Settings_ → _Dashboards_ → _More Options icon_ → _Resources_ → _Add Resource_ → Set _Url_ as `/local/room-card.js` → Set _Resource type_ as `JavaScript Module`.
      **Note:** If you do not see the Resources menu, you will need to enable _Advanced Mode_ in your _User Profile_
    - **Using YAML:** Add following code to `lovelace` section.
        ```yaml
        resources:
            - url: /local/room-card.js
              type: module
        ```

## Configuration variables
The editor is supported from version 2.0.0, but if you want to use `yaml`, heres the properties:

| Name                  | Type            | Default     | Description                                                                                                                         |
| :-------------------- | :-------------- | :---------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `name`                | string          | Required    | Name of the room to render.                                                                                                         |
| `icon`                | string          | Required    | Icon to render.                                                                                                                     |
| `icon_color`          | string          | Optional    | The color of the room icon.  May contain [templates](https://www.home-assistant.io/docs/configuration/)                                                                                                                   |
| `secondary`           | string          | Optional    | Secondary info to render. May contain [templates](https://www.home-assistant.io/docs/configuration/templating/).                    |
| `action  `            | string          | Optional    | Action on tap                                                                                                       |
| `entities`            | list            | Optional    | Room state entities                                                                       |
<br>

Room State Entity
| Name                  | Type            | Default     | Description                                                                                                                         |
| :-------------------- | :-------------- | :---------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `type`                | enum            | Required    | Use `entity` or `template`                                                                                                          |
| `icon`                | string          | Required    | Icon to render.                                                                                                                     |
| `icon_off`            | string          | Optional    | Icon to render when state is off, if not set the icon will not be changed.                                                          |
| `entity`              | string          | Required    | Required if type is `entity`, the state from this will be used.                                                                     |
| `on_state`            | string          | Required    | Required if type is `entity`, the state that will be considered as on.                                                              |
| `condition`           | string          | Required    | Required if type is `template`. Supports template values, return any value for on state, and empty for off.                         |
| `color_on`   | string          | Optional    | The color for entitie icons when on. May contain [templates](https://www.home-assistant.io/docs/configuration/)                                                                           |
| `color_off`  | string          | Optional    | The color for entitie icons when off. May contain [templates](https://www.home-assistant.io/docs/configuration/)                                                                          |



### YAML Example
```yaml
type: custom:room-card
icon: mdi:home-outline
icon_color: "#333333"
name: Living Room
secondary: '{{states("sensor.living_room_temperature")}} °C'
action:
  action: navigate
  navigation_path: /lovelace/living-room
entities:
  - type: entity
    entity: climate.climate_living_room
    icon: mdi:heat-wave
    on_state: heating
  - type: template
    icon: mdi:ceiling-light
    icon_off: mdi:ceiling-light-outline
    condition: >-
      {% set lights_on = expand(area_entities('Living Room')) |
      selectattr('domain','eq','light') | selectattr('state','eq','on') | list |
      count %}{% if lights_on > 0 %}true{% endif %}
  - type: entity
    entity: binary_sensor.living_room_presence_presence
    on_state: 'on'
    icon: mdi:motion-sensor
    icon_off: mdi:motion-sensor-off
  - type: entity
    entity: media_player.living_room
    on_state: playing
    icon: mdi:speaker
    icon_off: mdi:speaker-off
  - type: entity
    entity: media_player.living_room_tv
    on_state: playing
    icon: mdi:television-classic
    icon_off: mdi:television-classic-off

```


### Theme customization
Room Card works without theme but you can add a theme like [Noctis](https://github.com/aFFekopp/noctis). If you want more information about themes, check out the official [Home Assistant documentation about themes][home-assitant-theme-docs].

<!-- Badges -->
[hacs-url]: https://github.com/hacs/integration
[hacs-badge]: https://img.shields.io/badge/hacs-default-orange.svg?style=flat-square
[release-badge]: https://img.shields.io/github/v/release/patrickfnielsen/hass-room-card?style=flat-square
[downloads-badge]: https://img.shields.io/github/downloads/patrickfnielsen/hass-room-card/total?style=flat-square
[build-badge]: https://img.shields.io/github/actions/workflow/status/patrickfnielsen/hass-room-card/build.yaml?branch=main&style=flat-square

<!-- References -->
[home-assistant]: https://www.home-assistant.io/
[home-assitant-theme-docs]: https://www.home-assistant.io/integrations/frontend/#defining-themes
[hacs]: https://hacs.xyz
[release-url]: https://github.com/patrickfnielsen/hass-room-card/releases

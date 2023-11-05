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
Room Card is designed to quckly show the state of a room, and when pressed it can navigate to a page for that room.

## Installation

### HACS
Room Card is available in [HACS][hacs] (Home Assistant Community Store).
1. Install HACS if you don't have it already
2. Open HACS in Home Assistant
3. Go to "Frontend" section
4. Click button with "+" icon
5. Search for "Room Card"

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
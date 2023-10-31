# Navigation
A component for the application's navigation menu

## Description
This component wraps up numerous components that make up the entire navigation menu, such as the logo, the search field, and various other navigation items. The navigation menu is mostly responsive, with some items being hidden in a drawer menu for viewports that are smaller than 1024px. Some of the components' functionalities (such as the search field's ability to search for cards) are pending further progress in the front-end and back-end projects.

The lowest viewport in which the component is mostly usable is roughly 560px, after which some components (particularly the search field and logo) start to overlap.

The component is currently static and does not render the correct navigation menu for guests or logged in users. This will change in the future.

## Usage example
```jsx
<Navigation />
```
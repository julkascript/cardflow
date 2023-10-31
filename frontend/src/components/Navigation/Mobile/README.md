# MobileNavigation
Navigation menu items for small screens.

## Props
* ``onClose`` (**required**) - within the component can be found a "close menu" button. Clicking the button will call whatever function is passed via this prop. The passed function must accept a ``React.MouseEvent`` argument.

## Description
This component renders various navigation items in a navigation drawer, which can be opened via a menu button that is also rendered by the component. This component is designed for use in viewports which are smaller than 1024px.

## Usage

```jsx
function doSomething(event: React.MouseEvent) {
  // ...
}

/*
  If the "Close menu" button is clicked, the "doSomething" function
  will be called.
*/
<MobileNavigation onClose={doSomething} />
```
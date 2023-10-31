# Logo
A SVG-based logo whose size and color can be configured with props

## Props
* ``size``(**required**) - sets the logo's ``width`` and ``height``. The passed number is expressed in pixels.
* ``color`` - sets the logo's ``fill`` color, defaults to ``black``.

## Description
Being a SVG, this component scales up perfectly with any size, meaning that it can be rendered as a small logo or a big one. The tilda (~) is always placed in the center.

**Note:** user select on the logo is disabled.

## Usage example
```jsx
/*
  This will render the logo with a width and height of 50px
  and a white fill color.
*/
<Logo size={50} color="white" />
```

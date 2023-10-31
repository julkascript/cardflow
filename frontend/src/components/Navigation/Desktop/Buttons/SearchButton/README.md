# SearchButton
A search icon button, intended to be placed within a search field.

## Description
This button can be used as an input adorment for Material UI's `TextField` component. It is recommended to put the search field somewhere within a `form` tag to trigger a submit event when clicked, as the button itself doesn't have any special functionalities.

## Usage example
```jsx
/*
  The button will be placed at the beginning of the field.
  Upon a click, the form will be submitted, triggering the
  doSomething function.
*/
<form onSubmit={doSomething}>
  <TextField
    InputProps={{
      startAdornment: <SearchButton />,
    }}
  />
</form>
```

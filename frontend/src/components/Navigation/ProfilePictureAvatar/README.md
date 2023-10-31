# ProfilePictureAvatar
An avatar image which links to the user's profile

## Props
* ``imageUrl`` - the URL to the user's image. If the image cannot be resolved,
the component will display a generic avatar image.

## Description
This component is a link that consists of the user's profile picture.

The exact implementation of the linking mechanism is pending an integration of a client-side router, as well as advancement of the back-end project.

## Usage example
```jsx
<ProfilePictureAvatar imageUrl="/link-to-image.jpg" />
```
export const toastMessages = {
  success: {
    login: 'Logged in successfully!',
    register: 'Successful registration!',
    logout: 'Successfully logged out!',
    usernameChanged:
      'Your username was changed successfully! Please log in again to see your changes',
    emailChanged: 'Your username was changed successfully! Please log in again to see your changes',
    avatarChanged: 'Your avatar was updated successfully!',
    shipmentAddressChanged: 'Your default shipment address was updated successfully!',
    accountDeleted:
      'Your account was deleted successfully! Please remember that you cannot undo this action!',
    shoppingCartItemDeleted: 'Listing removed from the shopping cart',
    shoppingCartEmptiedOut: 'You have emptied your shopping cart out',
    shoppingCartItemAdded: (name: string, setCode: string) =>
      `${name} (${setCode}) was added to your cart!`,
    checkout: 'Checkout was successful!',
    listingUpdated: (name: string, setCode: string) =>
      `Listing for ${name} (${setCode}) was updated successfully!`,
    listingVisibilityChanged: (name: string, setCode: string, isListed: boolean) =>
      `Listing for ${name} (${setCode}) was ${isListed ? 'delisted' : 'made visible'}`,
    listingDeleted: (name: string, setCode: string) =>
      `Listing for ${name} (${setCode}) was deleted successfully`,
    listingCreated: (name: string, setCode: string) =>
      `Listing for ${name} (${setCode}) was created successfully!`,
  },
  error: {
    serverError: 'Something went wrong, please try again later!',
    notLoggedIn: 'You must be logged in to perform this action!',
    noPermission: 'You do not have permissions to perform this action!',
    pageDoesNotExist: 'The page you are looking for does not exist',
    failedLogin: 'Wrong username or password!',
    failedShoppingCartQuantityUpdate: 'Could not update quantity, please try again!',
  },
};

export const menuReducer = (
  state = {
    isOpen: false,
  },
  action,
) => {
  switch (action.type) {
    case 'OPEN_MENU_HANDLER':
      return { isOpen: action.payload.isOpen }
    default:
      return state
  }
}

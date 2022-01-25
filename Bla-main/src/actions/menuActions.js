export const openMenuHandler = (isOpen) => {
  return {
    type: 'OPEN_MENU_HANDLER',
    payload: { isOpen },
  }
}

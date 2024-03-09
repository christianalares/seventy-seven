'use client'

import { MainMenuSheet } from './main-menu-sheet'
import { MessagesListSheet } from './messages-list-sheet'

export const AllSheets = () => {
  return (
    <>
      <MainMenuSheet />
      <MessagesListSheet />
    </>
  )
}

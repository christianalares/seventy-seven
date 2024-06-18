'use client'

import { Alert, AlertDescription, AlertFooter, AlertTitle } from '@seventy-seven/ui/alert'
import { Button } from '@seventy-seven/ui/button'
import { DialogHeader } from '@seventy-seven/ui/dialog'
import { popAlert } from '.'

export const ProhibitLastOwnerRoleChangeAlert = () => {
  return (
    <Alert>
      <DialogHeader>
        <AlertTitle>You are the last owner</AlertTitle>
        <AlertDescription>
          You are the last owner in this team and can therefore not change your role to member. Please transfer
          ownership before changing your role.
        </AlertDescription>
      </DialogHeader>

      <AlertFooter>
        <Button onClick={() => popAlert('prohibitLastOwnerRoleChange')}>Ok</Button>
      </AlertFooter>
    </Alert>
  )
}

import React, { useState } from 'react'
import SafeList from '@/components/sidebar/SafeList'
import { DataWidget } from '@/components/welcome/SafeListDrawer/DataWidget'
import { Button, Drawer, Typography } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useAppSelector } from '@/store'
import { selectTotalAdded } from '@/store/addedSafesSlice'
import drawerCSS from '@/components/sidebar/Sidebar/styles.module.css'
import css from './styles.module.css'

const SafeListDrawer = () => {
  const totalNumberOfSafes = useAppSelector(selectTotalAdded)
  const [showSidebar, setShowSidebar] = useState(false)

  const closeSidebar = () => setShowSidebar(false)

  if (totalNumberOfSafes <= 0) {
    return null
  }

  return (
    <>
      <Drawer variant="temporary" anchor="left" open={showSidebar} onClose={closeSidebar}>
        <div className={drawerCSS.drawer}>
          <SafeList closeDrawer={closeSidebar} />

          <div className={drawerCSS.dataWidget}>
            <DataWidget />
          </div>
        </div>
      </Drawer>
      <Button
        className={css.button}
        fullWidth
        variant="contained"
        color="background"
        startIcon={<ChevronRightIcon />}
        onClick={() => setShowSidebar(true)}
      >
        <Typography className={css.buttonText} component="span" fontWeight="bold">
          My Safe Accounts{' '}
          <Typography color="text.secondary" fontWeight="bold">
            ({totalNumberOfSafes})
          </Typography>
        </Typography>
      </Button>
    </>
  )
}

export default SafeListDrawer

// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { getBlessingTitle, getBlessingDesc } from 'src/@core/utils/blessing'

import {simpleShow} from 'src/@core/components/wallet/address'

import { ethers } from 'ethers';

const CardWithCollapse = (props) => {


  return (
    <Card>
      <CardMedia sx={{ height: '22rem' }} image={props.blessing.image} />
      <CardContent>
        <Typography variant='h6' sx={{ marginBottom: 2 }}>
          {getBlessingTitle(props.blessing.description)}
        </Typography>
        <Typography variant='body2'>
          {getBlessingDesc(props.blessing.description)}
        </Typography>
      </CardContent>
      <Button variant='contained' sx={{ py: 2.5, width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        Send Blessing
      </Button>
      <CardContent>
        <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant='h6'>{simpleShow(props.blessing.owner)}</Typography>
              <Typography variant='caption'>Designer</Typography>
            </Box>
            <Button startIcon={<AttachMoneyIcon />} variant='outlined' color='error'>{ethers.utils.formatEther(props.blessing.price).toString()} BUSD</Button>
          </Box>
      </CardContent>
    </Card>
  )
}

export default CardWithCollapse

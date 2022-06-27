// ** React Imports
import { useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'

// ** Icons Imports
import Twitter from 'mdi-material-ui/Twitter'
import Telegram from '@mui/icons-material/Telegram';

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '40rem' }
}))

const ClaimPage = () => {

  // ** Hook
  const router = useRouter()

  const { sender } = router.query
  const { blessingID } = router.query
  console.log(sender, blessingID)

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent>

          <Divider sx={{ my: 5 }}></Divider>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Link target='_blank' href='https://twitter.com/cryptoblessing4' passHref>
              <IconButton component='a'>
                <Twitter sx={{ color: '#1da1f2' }} />
              </IconButton>
            </Link>
            <Link target='_blank' href='https://t.me/crypto_blessing_eng' passHref>
              <IconButton component='a'>
                <Telegram sx={{ color: '#1da1f2' }} />
              </IconButton>
            </Link>
          </Box>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
ClaimPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default ClaimPage

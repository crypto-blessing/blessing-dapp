// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

// ** Demo Components Imports
import BlessingCard2 from 'src/views/cards/BlessingCard2'

import { ethers } from 'ethers'
import CryptoBlessing from 'src/artifacts/contracts/CryptoBlessing.sol/CryptoBlessing.json'
import { useWeb3React } from "@web3-react/core"
import {cryptoBlessingAdreess, BUSDContractAddress} from 'src/@core/components/wallet/address'

import { useEffect, useState } from "react"

const Blessings = () => {

    const { active, account, chainId } = useWeb3React()
    const [blessings, setBlessings] = useState([])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function fetchBlessings() {
        if (active && chainId != 'undefined' && typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const cbContract = new ethers.Contract(cryptoBlessingAdreess(chainId), CryptoBlessing.abi, provider.getSigner())
            try {
                setBlessings(await cbContract.getAllBlessings())
            } catch (err) {
                setBlessings([{
                    image: 'gongxifacai.gif',
                    description: 'gong xi fa cai#In every Chinese New Year, the greetings among Chinese',
                    price: BigInt(0.1 * 10 ** 18),
                    owner: '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097',
                }])
                console.log("Error: ", err)
            }
            
        } else {
            setBlessings([{
                image: 'gongxifacai.gif',
                description: 'gong xi fa cai#In every Chinese New Year, the greetings among Chinese',
                price: BigInt(0.1 * 10 ** 18),
                owner: '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097',
            }])
        }
    }

    useEffect(() => {
        fetchBlessings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainId, account])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h5'>
                <Link href=''>
                    Material Design Icons
                </Link>
                </Typography>
                <Typography variant='body2'>Material Design Icons from the Community</Typography>
            </Grid>
            {blessings?.map((blessing) => (
                <Grid key={blessing.image} item xs={12} md={2}>
                    <BlessingCard2 blessing={blessing} />
                </Grid>
            ))}   
        </Grid>
    )
}

export default Blessings

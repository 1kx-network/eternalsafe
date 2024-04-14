import type { BaseSyntheticEvent, ReactElement } from 'react'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import PlusIcon from '@/public/images/common/plus.svg'

import css from './styles.module.css'
import {
  Button,
  CircularProgress,
  Collapse,
  DialogActions,
  DialogContent,
  Grid,
  InputAdornment,
  SvgIcon,
  Typography,
} from '@mui/material'
import AddressInput from '@/components/common/AddressInput'
import { FormProvider, useForm } from 'react-hook-form'
import { useToken } from '@/hooks/useToken'
import NameInput from '@/components/common/NameInput'
import NumberInput from '@/components/common/NumberInput'
import { useAppDispatch } from '@/store'
import { add } from '@/store/customTokensSlice'
import { TokenType } from '@safe-global/safe-apps-sdk'
import { useCurrentChain } from '@/hooks/useChains'
import { getAddress } from 'ethers/lib/utils'
import ErrorMessage from '@/components/tx/ErrorMessage'

export type TokenEntry = {
  address: string
  name: string
  symbol: string
  decimals: number | undefined
}

const AddToken = ({
  columns,
  defaultValues = {
    address: '',
    name: '',
    symbol: '',
    decimals: undefined,
  },
}: {
  columns: number
  defaultValues?: TokenEntry
}): ReactElement => {
  const dispatch = useAppDispatch()
  const chain = useCurrentChain()

  const [showAddToken, setShowAddToken] = useState<boolean>(false)
  const [addTokenError, setAddTokenError] = useState<Error | undefined>()

  const handleClickAddToken = () => {
    setShowAddToken(!showAddToken)
  }

  const methods = useForm<TokenEntry>({
    defaultValues,
    mode: 'onChange',
  })

  const { handleSubmit, formState, watch, reset } = methods

  const submitCallback = handleSubmit((inputData: TokenEntry) => {
    try {
      if (!chain) throw new Error('No chain selected')

      const token = {
        chainId: parseInt(chain.chainId),
        address: getAddress(inputData.address),
        name: inputData.name || data?.name || '',
        symbol: inputData.symbol || data?.symbol || '',
        decimals: inputData.decimals || data?.decimals || 18,
        logoUri: '',
        type: TokenType.ERC20,
      }

      dispatch(add([chain.chainId, token]))
      reset()
      setShowAddToken(false)
    } catch (error) {
      if (error instanceof Error) {
        setAddTokenError(error)
      } else {
        setAddTokenError(new Error('Unknown error when adding token.'))
      }
    }
  })

  const onSubmit = (e: BaseSyntheticEvent) => {
    e.stopPropagation()
    submitCallback(e)
  }

  const [data, error, loading] = useToken(watch('address'))

  return (
    <TableRow>
      <TableCell colSpan={columns - 1}>
        <div className={css.addToken} onClick={handleClickAddToken}>
          <SvgIcon component={PlusIcon} inheritViewBox fontSize="small" sx={{ ml: 1 }} />

          <Typography>Add Token</Typography>
        </div>
        <Collapse in={showAddToken}>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <DialogContent>
                <Box>
                  <AddressInput name="address" label="Token Address" variant="outlined" autoFocus fullWidth required />
                </Box>
              </DialogContent>

              <Collapse in={!!data}>
                <DialogContent>
                  <Grid
                    container
                    spacing={3}
                    alignItems="center"
                    marginBottom={3}
                    flexWrap={['wrap', undefined, 'nowrap']}
                  >
                    <Grid item xs={12}>
                      <NameInput
                        name="name"
                        label="Token name"
                        InputLabelProps={{ shrink: true }}
                        placeholder={data?.name || 'Token name'}
                        InputProps={{
                          endAdornment: loading ? (
                            <InputAdornment position="end">
                              <CircularProgress size={20} />
                            </InputAdornment>
                          ) : null,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <NameInput
                        name="symbol"
                        label="Token symbol"
                        InputLabelProps={{ shrink: true }}
                        placeholder={data?.symbol || 'Token symbol'}
                        InputProps={{
                          endAdornment: loading ? (
                            <InputAdornment position="end">
                              <CircularProgress size={20} />
                            </InputAdornment>
                          ) : null,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <NumberInput
                        name="decimals"
                        label="Token decimals"
                        InputLabelProps={{ shrink: true }}
                        placeholder={data?.decimals.toString() || 'Token decimals'}
                        InputProps={{
                          endAdornment: loading ? (
                            <InputAdornment position="end">
                              <CircularProgress size={20} />
                            </InputAdornment>
                          ) : null,
                        }}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
              </Collapse>

              <Collapse in={!!error || !!addTokenError}>
                <DialogContent>
                  {error && (
                    <ErrorMessage>Error loading token information, please double check the address.</ErrorMessage>
                  )}
                  {addTokenError && <ErrorMessage>{addTokenError.message}</ErrorMessage>}
                </DialogContent>
              </Collapse>

              <DialogActions>
                <Button type="submit" variant="contained" disabled={!formState.isValid || !data} disableElevation>
                  Add
                </Button>
              </DialogActions>
            </form>
          </FormProvider>
        </Collapse>
      </TableCell>
      <TableCell />
    </TableRow>
  )
}

export default AddToken

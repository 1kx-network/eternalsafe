import dynamic from 'next/dynamic'

export const AddOwnerFlow = dynamic(() => import('./AddOwner'))
export const ChangeThresholdFlow = dynamic(() => import('./ChangeThreshold'))
export const ConfirmBatchFlow = dynamic(() => import('./ConfirmBatch'))
export const ConfirmTxFlow = dynamic(() => import('./ConfirmTx'))
export const NewSpendingLimitFlow = dynamic(() => import('./NewSpendingLimit'))
export const NewTxFlow = dynamic(() => import('./NewTx'))
export const NftTransferFlow = dynamic(() => import('./NftTransfer'))
export const RejectTxFlow = dynamic(() => import('./RejectTx'))
export const RemoveGuardFlow = dynamic(() => import('./RemoveGuard'))
export const RemoveModuleFlow = dynamic(() => import('./RemoveModule'))
export const RemoveOwnerFlow = dynamic(() => import('./RemoveOwner'))
export const RemoveSpendingLimitFlow = dynamic(() => import('./RemoveSpendingLimit'))
export const ReplaceOwnerFlow = dynamic(() => import('./ReplaceOwner'))
export const ReplaceTxFlow = dynamic(() => import('./ReplaceTx'))
export const SuccessScreenFlow = dynamic(() => import('./SuccessScreen'))
export const TokenTransferFlow = dynamic(() => import('./TokenTransfer'))
export const UpdateSafeFlow = dynamic(() => import('./UpdateSafe'))

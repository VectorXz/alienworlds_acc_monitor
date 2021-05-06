import AccountInfo from './AccountInfo'

export default function AccountTable(props) {
    const { accounts, onDelete } = props

    return (
        <div className="flex flex-col w-full">
            {accounts.length === 0 && <span className="text-3xl font-bold text-center text-red-400">No accounts added yet!</span>}
            {accounts.length > 0 && accounts.map((acc, i) => {
                return (
                    <AccountInfo key={i} account={acc} onDelete={onDelete} />
                )
            })}
        </div>
    )
}
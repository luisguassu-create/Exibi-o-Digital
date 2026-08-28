type Props = { 
  corFundoB: string; 
  onClick?: ( 
    event: React.MouseEvent<HTMLButtonElement> 
  ) => void; 
} 

export default function BotaoCores({ corFundoB, onClick }: Props) { 
  return ( 
    <button 
      onClick={onClick}
      style={{ 
        background: corFundoB, 
        width: "30px", 
        height: "30px", 
        borderRadius: "50%", 
        border: "none",
        cursor: "pointer"
      }} 
    ></button> 
  ); 
}
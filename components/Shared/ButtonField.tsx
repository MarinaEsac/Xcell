interface ButtonFieldProps {
    title?: string;
    type?: 'button' | 'submit' | 'reset';
    style?: string ;
    handleButtonClick?: () => void;
    icon?: React.ReactNode;
  }
  
  const ButtonField: React.FC<ButtonFieldProps> = ({
    title,
    type = 'button',
    style ,
    handleButtonClick,
    icon,
  }) => {  
    return (
      <button
        type={type}
        className={`px-4 py-2 font-semibold rounded ${style}`}
        onClick={handleButtonClick}
      >
        {icon && <span>{icon}</span>} 
        {title}
      </button>
    );
  };
  
  export default ButtonField;
  
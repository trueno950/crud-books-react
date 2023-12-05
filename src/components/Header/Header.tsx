import "./header.scss";

export const Header = () => {
  return (
    <header className="header">
      <div className="header-wrapper">
        <h3>Grupo Promass Prueba</h3>
        {/* {user?.firstName && (
          <div className="header-actions">
            <RightFromBracketIcon
              width={25}
              className="header-icons"
              onClick={() => setShowConfirm(true)}
            />
          </div>
        )} */}
      </div>
    </header>
  );
};

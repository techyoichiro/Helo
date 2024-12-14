export const ContentWrapper: React.FC<{ children: React.ReactNode }> = (
    props
  ) => {
    return <div className="max-w-[960px] mx-auto px-[1.3rem]">{props.children}</div>;
  };
  
  export const UndoWrapForScroll: React.FC<{
    children: React.ReactNode;
  }> = (props) => {
    return <div className="-mr-[1.3rem]">{props.children}</div>;
  };
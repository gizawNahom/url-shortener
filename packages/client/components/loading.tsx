export function Loading({ colored }: { colored?: boolean }) {
  const classes = `${getBorderColor()} align-middle inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]`;
  return (
    <div className={classes} role="status">
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );

  function getBorderColor() {
    return colored ? 'border-cyan-500' : '';
  }
}

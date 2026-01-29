const Logo = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center lg:hidden">
        <h1 className="text-lg font-semibold tracking-wider text-primary">
          IS
        </h1>

        <div className="w-full my-0.5">
          <div className="flex-1 h-px bg-secondary"></div>
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-center">
        <h1 className="font-bold tracking-[0.2em] text-primary">
          INTERNATIONAL
        </h1>

        <div className="flex items-center gap-3 w-full my-1">
          <div className="flex-1 h-px bg-secondary"></div>
          <span className="text-[10px] tracking-[0.2em] text-accent font-medium">
            SCHOOL
          </span>
          <div className="flex-1 h-px bg-secondary"></div>
        </div>
      </div>
    </div>
  );
};

export default Logo;

import './MarketTable.css';

/**
 * A ``table`` tag with preconfigured CSS styles. Other than styling the table itself,
 * this component also provides styling for ``td`` and ``th`` that are
 * elements passed as its children.
 */
function MarketTable({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return <table className={`market-table-wrapper ${className || ''}`}>{children}</table>;
}

export default MarketTable;

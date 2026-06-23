export function DataTable({ columns, rows = [], emptyMessage = 'No records yet. Add your own data to get started.' }) {
  return (
    <div className="panel" style={{ overflowX: 'auto' }}>
      {rows.length === 0 ? (
        <p className="muted" style={{ margin: 0 }}>
          {emptyMessage}
        </p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                {columns.map(column => (
                  <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

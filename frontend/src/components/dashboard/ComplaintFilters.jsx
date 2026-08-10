function ComplaintFilters({ filters, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="form-group">
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="form-input"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <div className="form-group">
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="form-input"
        >
          <option value="">All Categories</option>
          <option value="Housekeeping">Housekeeping</option>
          <option value="Carpenter">Carpenter</option>
          <option value="Electrician">Electrician</option>
        </select>
      </div>

      <div className="form-group">
        <label className="block text-sm font-medium mb-1">Time Period</label>
        <select
          value={filters.dateRange}
          onChange={(e) => handleChange('dateRange', e.target.value)}
          className="form-input"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>
    </div>
  );
}

export default ComplaintFilters;

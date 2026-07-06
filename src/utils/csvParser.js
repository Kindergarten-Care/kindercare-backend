/**
 * CSV Parser Utility
 * Handles CSV parsing with UTF-8 BOM support
 */

/**
 * Parse CSV buffer to array of objects
 * @param {Buffer} buffer - CSV file buffer
 * @returns {Array} Array of parsed rows
 */
export const parseCSV = (buffer) => {
  if (!buffer || buffer.length === 0) {
    return [];
  }

  // Convert buffer to string with UTF-8 support
  let content = buffer.toString('utf-8');

  // Remove BOM (Byte Order Mark) if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.substring(1);
  }

  // Split into lines
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');

  if (lines.length < 2) {
    return []; // Need at least header + 1 data row
  }

  // Parse header
  const headers = parseCSVLine(lines[0]).map(h => h.trim());

  // Parse data rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const row = {};
    headers.forEach((header, index) => {
      let value = values[index] || '';
      // Trim and clean up value
      value = value.trim();
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      // Replace escaped quotes
      value = value.replace(/""/g, '"');
      row[header] = value;
    });

    // Only add row if it has at least some data
    if (Object.values(row).some(v => v && v !== '')) {
      rows.push(row);
    }
  }

  return rows;
};

/**
 * Parse a single CSV line handling quoted values
 * @param {string} line - CSV line
 * @returns {Array} Array of values
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Comma outside quotes - field separator
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current);

  return result;
};

/**
 * Validate CSV data structure
 * @param {Array} data - Parsed CSV data
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
export const validateCSVData = (data) => {
  const errors = [];

  if (!Array.isArray(data) || data.length === 0) {
    return { valid: false, errors: ['Dữ liệu CSV trống'] };
  }

  // Required columns
  const requiredColumns = ['Week', 'Day', 'StartTime', 'EndTime', 'ActivityName'];
  const firstRow = data[0];

  const missingColumns = requiredColumns.filter(col => !(col in firstRow));
  if (missingColumns.length > 0) {
    errors.push(`Thiếu cột bắt buộc: ${missingColumns.join(', ')}`);
  }

  // Validate each row
  const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const validActivityTypes = ['pickup', 'meal', 'study', 'nap', 'play', 'dropoff', 'other'];
  const weekNumbers = new Set();

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNum = i + 2; // +2 because of 0-index and header row

    // Week validation
    const week = parseInt(row.Week);
    if (isNaN(week) || week < 1 || week > 5) {
      errors.push(`Dòng ${rowNum}: Week phải là số từ 1-5`);
    } else {
      weekNumbers.add(week);
    }

    // Day validation
    if (!validDays.includes(row.Day)) {
      errors.push(`Dòng ${rowNum}: Day không hợp lệ (${row.Day}). Chấp nhận: ${validDays.join(', ')}`);
    }

    // Time validation (HH:MM or HH:MM:SS)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
    if (!timeRegex.test(row.StartTime)) {
      errors.push(`Dòng ${rowNum}: StartTime không đúng định dạng (${row.StartTime}). Định dạng: HH:MM`);
    }
    if (!timeRegex.test(row.EndTime)) {
      errors.push(`Dòng ${rowNum}: EndTime không đúng định dạng (${row.EndTime}). Định dạng: HH:MM`);
    }

    // Activity name validation
    if (!row.ActivityName || row.ActivityName.trim() === '') {
      errors.push(`Dòng ${rowNum}: ActivityName bắt buộc`);
    }

    // Activity type validation (if provided)
    if (row.ActivityType && !validActivityTypes.includes(row.ActivityType)) {
      errors.push(`Dòng ${rowNum}: ActivityType không hợp lệ (${row.ActivityType}). Chấp nhận: ${validActivityTypes.join(', ')}`);
    }
  }

  // Check for duplicate entries (same Week + Day + StartTime)
  const seen = new Set();
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const key = `${row.Week}-${row.Day}-${row.StartTime}`;
    if (seen.has(key)) {
      errors.push(`Dòng ${i + 2}: Trùng lặp (Week, Day, StartTime)`);
    }
    seen.add(key);
  }

  return {
    valid: errors.length === 0,
    errors,
    weekCount: weekNumbers.size,
    rowCount: data.length
  };
};

/**
 * Generate CSV template
 * @param {number} weeks - Number of weeks (1-4)
 * @returns {string} CSV template content
 */
export const generateCSVTemplate = (weeks = 4) => {
  const headers = ['Week', 'Day', 'StartTime', 'EndTime', 'ActivityName', 'ActivityType', 'Details', 'Location'];
  const rows = [headers.join(',')];

  const defaultActivities = [
    { day: 'Monday', time: '07:30', end: '08:30', name: 'Đón bé & Thể dục sáng', type: 'pickup', details: 'Tập bài dân vũ', location: 'Sân trường' },
    { day: 'Monday', time: '08:30', end: '09:00', name: 'Ăn sáng', type: 'meal', details: 'Suất ăn sáng theo thực đơn', location: 'Phòng ăn' },
    { day: 'Monday', time: '09:00', end: '10:15', name: 'Học tập', type: 'study', details: 'Hoạt động học tập', location: 'Lớp học' },
    { day: 'Monday', time: '10:15', end: '11:15', name: 'Vui chơi tự do', type: 'play', details: 'Chơi tự do', location: 'Lớp học' },
    { day: 'Monday', time: '11:15', end: '14:00', name: 'Ăn trưa & Ngủ trưa', type: 'nap', details: 'Cơm trưa + giấc ngủ trưa', location: 'Phòng ngủ' },
    { day: 'Monday', time: '14:00', end: '14:30', name: 'Ăn xế', type: 'meal', details: 'Trái cây + sữa', location: 'Phòng ăn' },
    { day: 'Monday', time: '14:30', end: '16:00', name: 'Hoạt động chiều', type: 'study', details: 'Kể chuyện hoặc thủ công', location: 'Lớp học' },
    { day: 'Monday', time: '16:00', end: '17:00', name: 'Trả trẻ', type: 'dropoff', details: 'Chuẩn bị đồ dùng và đợi ba mẹ đón', location: 'Cổng A' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let w = 1; w <= weeks; w++) {
    for (const day of days) {
      const activities = defaultActivities.filter(a => a.day === day);
      for (const act of activities) {
        const row = [
          w,
          day,
          act.time,
          act.end,
          `"${act.name}"`,
          act.type,
          `"${act.details}"`,
          `"${act.location}"`
        ];
        rows.push(row.join(','));
      }
    }
  }

  return rows.join('\n');
};

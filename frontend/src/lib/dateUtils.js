export const formatDate = (dateString) => {
    if (!dateString) {
        return '-';
    }

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '-';
        }

        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return '-';
    }
};

export const parseDate = (dateString) => {
    if (!dateString) {
        return null;
    }

    try {
        return new Date(dateString);
    } catch (error) {
        console.error('Error parsing date:', error);
        return null;
    }
};

export const isDateInRange = (date, startDate, endDate) => {
    // If date is null/undefined, exclude from range
    if (!date) {
        return false;
    }

    try {
        const targetDate = parseDate(date);
        const start = startDate ? parseDate(startDate) : null;
        const end = endDate ? parseDate(endDate) : null;

        // Check if target date is valid
        if (isNaN(targetDate.getTime())) {
            return false;
        }

        if (start && end) {
            return targetDate >= start && targetDate <= end;
        } else if (start) {
            return targetDate >= start;
        } else if (end) {
            return targetDate <= end;
        }
        return true;
    } catch (error) {
        console.error('Error in date range check:', error);
        return false;
    }
};

export const sortByDate = (a, b, field, direction = 'asc') => {
    const dateA = parseDate(a[field]);
    const dateB = parseDate(b[field]);

    // Handle null dates - put them at the end
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    // Check for invalid dates
    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1;

    if (direction === 'asc') {
        return dateA - dateB;
    } else {
        return dateB - dateA;
    }
};

export const sortByString = (a, b, field, direction = 'asc') => {
    const stringA = (a[field] || '').toString().toLowerCase();
    const stringB = (b[field] || '').toString().toLowerCase();

    if (direction === 'asc') {
        return stringA.localeCompare(stringB);
    } else {
        return stringB.localeCompare(stringA);
    }
};
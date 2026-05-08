import { useEffect, useState } from 'react';
import { analyticsService } from '../services/analytics.service.js';

let cachedUsage = null;

export function useUsageLimit() {
    const [usage, setUsage] = useState(cachedUsage);

    useEffect(() => {
        analyticsService.getUsage().then(data => {
            cachedUsage = data;
            setUsage(data);
        }).catch(() => { });
    }, []);

    const isLimitReached = (type) => {
        if (!usage) return false;
        const map = { report: usage?.reports, resume: usage?.resumes, mock: usage?.mockInterviews };
        const u = map[type];
        return u ? u.used >= u.limit : false;
    };

    const getResetsOn = (type) => usage?.resetsAt || null;

    return { usage, isLimitReached, getResetsOn };
}
import { useEffect, useState } from 'react';

const useNotifications = () => {
  const [permission, setPermission] = useState('default');
  const [_registration, _setRegistration] = useState(null);

  useEffect(() => {
    // Check if the browser supports notifications
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Register service worker for push notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(reg => _setRegistration(reg))
        .catch(err => console.error('Service worker registration failed:', err));
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      return permission;
    }
    return 'denied';
  };

  const scheduleNotification = async ({
    title,
    body,
    icon = '/icon.png',
    timestamp
  }) => {
    if (permission !== 'granted') {
      const newPermission = await requestPermission();
      if (newPermission !== 'granted') return false;
    }

    const now = Date.now();
    const delay = timestamp - now;

    if (delay > 0) {
      setTimeout(() => {
        new Notification(title, { body, icon });
      }, delay);
    } else {
      new Notification(title, { body, icon });
    }

    return true;
  };

  const scheduleWorkoutReminder = (workoutTime) => {
    // Schedule reminder 30 minutes before workout
    const reminderTime = new Date(workoutTime);
    reminderTime.setMinutes(reminderTime.getMinutes() - 30);

    return scheduleNotification({
      title: 'Workout Reminder',
      body: 'Your workout starts in 30 minutes. Time to get ready! 💪',
      timestamp: reminderTime.getTime()
    });
  };

  const scheduleMealReminder = (mealTime, mealType) => {
    return scheduleNotification({
      title: `${mealType} Time`,
      body: 'Time to log your meal and stay on track with your nutrition goals! 🍎',
      timestamp: mealTime.getTime()
    });
  };

  const scheduleWaterReminder = () => {
    // Schedule water reminders every 2 hours between 8 AM and 8 PM
    const now = new Date();
    const start = new Date(now);
    start.setHours(8, 0, 0, 0);
    const end = new Date(now);
    end.setHours(20, 0, 0, 0);

    if (now > end) {
      start.setDate(start.getDate() + 1);
      end.setDate(end.getDate() + 1);
    }

    for (let time = start; time <= end; time.setHours(time.getHours() + 2)) {
      if (time > now) {
        scheduleNotification({
          title: 'Hydration Check',
          body: 'Time to drink water! Stay hydrated for optimal performance 💧',
          timestamp: time.getTime()
        });
      }
    }
  };

  const scheduleProgressUpdate = (checkInTime) => {
    return scheduleNotification({
      title: 'Weekly Progress Check',
      body: 'Time to review your progress and update your goals! 📊',
      timestamp: checkInTime.getTime()
    });
  };

  return {
    permission,
    requestPermission,
    scheduleNotification,
    scheduleWorkoutReminder,
    scheduleMealReminder,
    scheduleWaterReminder,
    scheduleProgressUpdate
  };
};

export default useNotifications;
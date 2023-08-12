const EmailNotification = () => {
  const EMAIL_NOTIFICATIONS = [

    {
      title: "Hashnode weekly",
      description: "Curated weekly newsletter with best stories and discussions",
    },
    {
      title: "Activities related to you and your content",
      description: "Replies, Responses, Reactions, Mentions etc…",
    },
    {
      title: "General announcements",
      description: "Product updates, feature additions, etc...",
    },
    {
      title: "Monthly blog posts stats newsletter",
      description: "Get monthly stats for your blog posts via email",
    },
    {
      title: "New Followers Weekly",
      description: "Get weekly stats about new followers",
    },
    {

      title: "Referral Notifications",
      description: "Get notified on Successful Referrals, Hashnode Ambassador Eligibility, Swag Kit Eligibility, etc...",
    }
  ];

  return <>
    <div className="mb-4">
      {
        EMAIL_NOTIFICATIONS.map((e, i) => (
          <div key={i} className="py-2 flex items-start gap-2 mb-2 last:mb-0">
            <input type="checkbox" className="mt-2" name={e.title} id={e.title} />

            <label htmlFor={e.title} className="flex-1">
              <h1 className="text-xl mb-1 font-medium text-gray-700 dark:text-text-secondary">
                {e.title}
              </h1>

              <p className="text-base text-gray-500 dark:text-text-primary">
                {e.description}
              </p>
            </label>
          </div>
        ))
      }
    </div>
    <button className="btn-outline">Update</button>
  </>
}

export default EmailNotification;
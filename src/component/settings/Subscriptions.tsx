import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { LogonoText } from "~/svgs";
import { api } from "~/utils/api";

const Subscription = () => {
  const { mutateAsync: createCheckoutSession } = api.stripe.createCheckoutSession.useMutation();
  const { data: session } = useSession();
  const { data: subscriptionStatus } = api.users.subscriptionStatus.useQuery(undefined, {
    enabled: !!session,
    refetchOnWindowFocus: false,
  });
  const { push } = useRouter();

  const handleUpgrade = async () => {
    const { checkoutUrl } = await createCheckoutSession();
    if (checkoutUrl) {
      void push(checkoutUrl);
    }
  }

  return (<div>
    <header className="pb-4 border-b border-border-light dark:border-border">
      <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
        Subscription
      </h1>
    </header>

    <section className="py-4">
      {subscriptionStatus ? (
        <div className="py-4">
          <h1 className="text-2xl mb-4 font-semibold text-gray-700 dark:text-text-secondary">
            You are already subscribed to Hashnode Pro
          </h1>

          <button className="btn-filled">Manage Plans</button>
        </div>
      ) : (

        <div className="anouncement flex items-center gap-4 rounded-md border border-border-light bg-white p-6 dark:border-border dark:bg-primary">
          <div className="flex-1">
            <header className="mb-2 flex gap-2 items-center">
              <span className="">
                <LogonoText className="h-6 w-6 fill-gray-700 dark:fill-text-secondary" />
              </span>
              <p className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                Hashnode Clone
                <span className="px-2 rounded-md bg-blue-500 text-base font-semibold text-white">PRO</span>
              </p>
            </header>

            <p className="text-sm text-gray-700 dark:text-text-secondary sm:text-base">
              Level up your publishing experience with Hahsnode Pro with powerful AI
              and premium features.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              role="button"
              onClick={() => void handleUpgrade()}
              aria-label="upgrade plan"
              className="btn-tertiary w-fit"
            >
              Upgrade now
            </button>
            <button
              role="button"
              aria-label="lean more on Hashnode pro"
              className="btn-outline w-fit text-sm text-white"
            >
              Learn more
            </button>
          </div>
        </div>
      )}

    </section>
  </div>)
}

export default Subscription;
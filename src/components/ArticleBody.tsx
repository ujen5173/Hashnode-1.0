import Image from "next/image";
import React from "react";
import Link from "next/link";
import { Book, Follow } from "~/svgs";
import ArticleActions from "./ArticleActions";

const ArticleBody = () => {
  return (
    <main className="min-h-screen bg-white pb-12 dark:bg-primary">
      <div className="mx-auto max-w-[1200px]">
        <Image
          src={
            "https://cdn.hashnode.com/res/hashnode/image/upload/v1684873418555/33553783-9d3d-4290-bd61-2d31af17db3c.jpeg?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp"
          }
          alt=""
          width={1200}
          height={800}
          className="mb-16  w-full object-cover px-4"
        />

        <section>
          <div className="px-4">
            <h1 className="mb-8 text-center text-5xl font-bold text-gray-700 dark:text-text-secondary">
              TypeScript utility types I use the most
            </h1>
            <h2 className="mb-10 text-center text-3xl font-semibold text-gray-600 dark:text-text-primary">
              TypeScript tools to have under your belt
            </h2>

            <div className="mx-auto mb-10 flex w-full flex-col items-center justify-center gap-4 md:w-fit lg:flex-row">
              <Link
                aria-label="Visit Profile"
                className="mb-10 flex items-center gap-4 lg:mb-0"
                href="/@test"
              >
                <Image
                  src={
                    "https://cdn.hashnode.com/res/hashnode/image/upload/v1664920854781/pxV1rFkj-.png?w=400&h=400&fit=crop&crop=faces&auto=compress,format&format=webp"
                  }
                  alt=""
                  width={70}
                  height={70}
                  className=" h-8 w-8 rounded-full"
                />
                <h1 className="text-xl font-semibold text-gray-700 dark:text-text-secondary">
                  Danijel Maksimovic&rsquo;s Blog
                </h1>
              </Link>

              <div className="flex w-full items-center justify-between gap-4 lg:w-fit">
                <span className="hidden text-gray-700 lg:block lg:text-text-secondary">
                  ·
                </span>
                <h3 className="text-lg font-medium text-gray-700 dark:text-text-primary">
                  May 24, 2023
                </h3>
                <span className="hidden text-gray-700 lg:block lg:text-text-secondary">
                  ·
                </span>
                <div className="flex items-center gap-2">
                  <Book className="h-5 w-5 fill-gray-700 dark:fill-text-primary" />
                  <span className="text-lg text-gray-700 dark:text-text-primary">
                    6 min read
                  </span>
                </div>
              </div>
            </div>

            <div className="article mb-10 w-full md:w-11/12 lg:w-10/12">
              <p>
                As the number of APIs that need to be integrated increases,
                managing the complexity of API interactions becomes increasingly
                challenging. By using the{" "}
                <a href="https://strip.com">API Gateway</a> we can create a
                sequence of API calls, which breaks down the API workflows into
                smaller, more manageable steps. For example, in an online
                shopping website when a customer searches for a product, the
                platform can send a request to the product search API, then send
                a request to the product details API to retrieve more
                information about the products. In this article, we will{" "}
                <strong>create a custom plugin</strong> for
                <a href="">Apache APISIX</a> API Gateway to handle client
                requests that should be called in sequence.
              </p>

              <h1>Learning objectives</h1>

              <ul>
                <p>You will learn the following throughout the article:</p>
                <li>What are chaining API requests?</li>
                <li>Example of sequential API calls.</li>
                <li>
                  How to build a custom pipeline-request plugin for Apache
                  APISIX.
                </li>
                <li>Pipeline-request plugin demo.</li>
              </ul>
              <img
                src="https://cdn.hashnode.com/res/hashnode/image/upload/v1684917347172/800887d6-e105-4697-980f-c8f011df0a7f.png?auto=compress,format&format=webp"
                alt="test"
              />
              <h1>What is a chaininng API request and why do we need it?</h1>
              <p>
                Chaining API requests (or pipeline requests, or sequential API
                calls) is a technique used in software development to manage the
                complexity of API interactions where software requires multiple
                API calls to complete a task. It is similar to batch request
                processing where you group multiple API requests into a single
                request and send them to the server as a batch. While they may
                seem similar, a pipeline request involves sending a single
                request to the server that triggers a sequence of API requests
                to be executed in a defined order. Each API request in the
                sequence can modify the request and response data, and the
                response from one API request is passed as input to the next API
                request in the sequence. Pipeline requests can be useful when a
                client needs to execute a sequence of dependent API requests
                that must be executed in a specific order. In each step of the
                pipeline, we can transform or manipulate the response data
                before passing it on to the next step. This can be useful in
                situations where data needs to be normalized or transformed or
                filter out sensitive data before it is returned to the client.
                It can help to reduce overall latency. For example, one API call
                can be made while another is waiting for a response, reducing
                the overall time needed to complete the workflow.
              </p>
              <img
                src="https://cdn.hashnode.com/res/hashnode/image/upload/v1684917349608/802ed42c-fa4b-4dc2-be74-b7b34fe16c1a.png?auto=compress,format&format=webp"
                alt=""
              />
              <h1>Pipeline-request plugin demo</h1>
              <p>
                For this demo, we are going to leverage another prepared{" "}
                <a href="">demo project</a> on GitHub where you can find all{" "}
                <a href="">curl command examples</a> used in this tutorial, run
                APISIX and enable a <a href="">custom plugin</a> without
                additional configuration with a{" "}
                <a href="">Docker compose.yml</a> file.
              </p>
              <h1>Prerequisites</h1>
              <ul>
                <li>
                  <a href="">Docker</a> is used to installing the containerized
                  etcd and APISIX.
                </li>
                <li>
                  <a href="">curl</a> is used to send requests to{" "}
                  <code>APISIX Admin</code>
                  API. You can also use easy tools such as{" "}
                  <a href="">Postman</a> to interact with the API.
                </li>
              </ul>

              <pre>
                {`curl -X PUT 'http://127.0.0.1:9180/apisix/admin/routes/1' \
  --header 'X-API-KEY: edd1c9f034335f136f87ad84b625c8f1' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "uri":"/my-credit-cards",
    "plugins":{
        "pipeline-request":{
          "nodes":[
              {
                "url":"https://random-data-api.com/api/v2/credit_cards"
              },
              {
                "url":"http://127.0.0.1:9080/filter"
              }
          ]
        }
    }
  }'`}
              </pre>
              <h1>Summary</h1>
              <p>
                Up to now, we learned that our custom pipeline request plugin
                for the Apache APISIX API Gateway allows us to define a sequence
                of API calls as a pipeline in a specific order. We can also use
                this new plugin with the combination of existing ones to enable
                authentication, security, and other API Gateway features for our
                API endpoints.
              </p>
            </div>
          </div>

          <ArticleActions />

          <ArticleTags
            tags={["react", "nextjs", "docker", "programming", "cloud"]}
          />

          <ArticleAuthor />
        </section>
      </div>
    </main>
  );
};

export default ArticleBody;

const ArticleTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="mx-auto my-20 flex w-full flex-wrap items-center justify-center gap-2 lg:w-8/12">
      {tags.map((tag, index) => (
        <Link href={`/tag/${tag}`} key={index}>
          <span className="block rounded-md border border-border-light bg-light-bg px-4 py-2 text-base text-gray-700 hover:shadow-md dark:border-border dark:bg-primary-light dark:text-text-secondary dark:hover:bg-border">
            {tag}
          </span>
        </Link>
      ))}
    </div>
  );
};

const ArticleAuthor = () => {
  return (
    <div className="mx-auto my-10 flex w-full items-start border-y border-border-light px-4 py-6 dark:border-border md:w-8/12">
      <div className="flex flex-1 flex-col items-start gap-4 md:flex-row">
        <Link href={`/@test`}>
          <Image
            src={
              "https://cdn.hashnode.com/res/hashnode/image/upload/v1671031219768/PPvbNBGkF.jpeg?w=256&h=256&fit=crop&crop=entropy&auto=compress,format&format=webp"
            }
            alt=""
            width={100}
            height={100}
            className="obejct-cover h-12 w-12 overflow-hidden rounded-full"
          />
        </Link>

        <div className="flex-1">
          <h2 className="text-uppercase mb-2 text-base font-medium text-gray-600 dark:text-text-primary">
            WRITTEN BY
          </h2>
          <Link href={`/@test`}>
            <h1 className="text-uppercase mb-4 text-xl font-semibold text-gray-800 dark:text-text-secondary">
              Hoh Shen Yien
            </h1>
          </Link>
          <p className="text-gray-600 dark:text-text-primary">
            My name is Hoh Shen Yien, I&apos;m a Malaysian fullstack developer
            who likes to read and write sometimes 🤩
          </p>
        </div>
      </div>
      <button className="btn-follow gap-2">
        <Follow className="h-4 w-4 fill-none stroke-secondary" />
        <span>Follow</span>
      </button>
    </div>
  );
};

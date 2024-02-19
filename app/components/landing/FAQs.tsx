import Container from "../common/Container";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[][] = [
  [
    {
      question: "What is Jittter?",
      answer:
        "Jittter is a productivity tool that helps you manage your tasks, notes, and calendar in one place.",
    },
    {
      question: "How does Jittter work?",
      answer:
        "Jittter is a web-based application that you can access from any device. It's designed to be simple and intuitive to use.",
    },
    {
      question: "What are the benefits of using Jittter?",
      answer:
        "Jittter helps you stay organized and focused, so you can be more productive and less stressed.",
    },
  ],
  [
    {
      question: "How much does Jittter cost?",
      answer:
        "Jittter is free to use, with optional premium features available for a monthly subscription.",
    },
    {
      question: "What are the premium features?",
      answer:
        "Premium features include advanced task management, increased storage, and more.",
    },
    {
      question: "Is Jittter secure?",
      answer:
        "Yes, Jittter takes security and privacy seriously. We use industry-standard encryption and security practices to protect your data.",
    },
  ],
  [
    {
      question: "Can I import/export my data from/to other applications?",
      answer:
        "Yes, our platform supports data import and export functionality, making it easy to integrate with other applications or migrate your data as needed.",
    },
    {
      question: "Can I use Jittter on my phone?",
      answer:
        "Yes, Jittter is designed to work on any device, including phones and tablets.",
    },
    {
      question: "How can I get help with Jittter?",
      answer:
        "You can contact our support team at any time for help with using Jittter.",
    },
  ],
];

const FAQs = () => {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-lg tracking-tight text-slate-700">
            If you can't find what you're looking for, chances are somebody else
            has asked the same question. Here are some of the most common
            questions we receive.
          </p>
        </div>

        <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-display text-lg leading-7 text-slate-900">
                      {faq.question}
                    </h3>

                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};

export default FAQs;

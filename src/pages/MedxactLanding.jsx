"use client";

import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import {
  Shield,
  Bot,
  CheckCircle,
  MessageSquare,
  QrCode,
  Share2,
  Star,
  CreditCard,
  Building2,
  Briefcase,
} from "lucide-react";

export default function MedxactLanding() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Bot,
      title: t("featureHealthTrackerTitle"),
      description: t("featureHealthTrackerDesc"),
    },
    {
      icon: Bot,
      title: t("featureAIInsightsTitle"),
      description: t("featureAIInsightsDesc"),
    },
    {
      icon: CheckCircle,
      title: t("featureSmartConsentTitle"),
      description: t("featureSmartConsentDesc"),
    },
    {
      icon: MessageSquare,
      title: t("featureSecureCommTitle"),
      description: t("featureSecureCommDesc"),
    },
    {
      icon: QrCode,
      title: t("featureEmergencyAccessTitle"),
      description: t("featureEmergencyAccessDesc"),
    },
    {
      icon: Share2,
      title: t("featureAnonResearchTitle"),
      description: t("featureAnonResearchDesc"),
    },
  ];

  const aboutItems = [
    {
      icon: Shield,
      title: t("featureSecureStorageTitle"),
      desc: t("featureSecureStorageDesc"),
    },
    {
      icon: Bot,
      title: t("featureAIInsightsTitle"),
      desc: t("featureAIInsightsDesc"),
    },
    {
      icon: CheckCircle,
      title: t("featurePrivacyControlTitle"),
      desc: t("featurePrivacyControlDesc"),
    },
    {
      icon: Share2,
      title: t("featureResearchImpactTitle"),
      desc: t("featureResearchImpactDesc"),
    },
  ];

  const reviews = [
    {
      name: t("review1Name"),
      role: t("review1Role"),
      review: t("review1Text"),
      rating: 5,
    },
    {
      name: t("review2Name"),
      role: t("review2Role"),
      review: t("review2Text"),
      rating: 5,
    },
    {
      name: t("review3Name"),
      role: t("review3Role"),
      review: t("review3Text"),
      rating: 5,
    },
  ];

  const plans = [
    {
      icon: CreditCard,
      title: "Freemium + Premium Subscription",
      description:
        "Free: Basic file uploads, vaccine tracking, limited storage. Premium: Higher storage, AI insights, support, multi-device sync.",
    },
    {
      icon: Building2,
      title: "White-Label Licensing",
      description:
        "Offer Medxact as a custom-branded solution for hospitals or NGOs managing immunization programs.",
    },
    {
      icon: Briefcase,
      title: "Digital Health Marketplace",
      description:
        "Integrate doctor consultations, lab tests, vaccine bookings, and earn commissions from 3rd-party services.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 text-center bg-gradient-to-br from-white via-blue-50 to-emerald-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-emerald-600 bg-clip-text text-transparent">
            {t("headingLine1")}
            <br />
            {t("headingLine2")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light mb-12 leading-relaxed">
            {t("description")}
            <br />
            <span className="text-gray-400">{t("tagline")}</span>
          </p>
          <div className="flex flex-col items-center gap-4 justify-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-700 via-blue-600 to-emerald-500 text-white px-8 py-4 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg font-medium">
                {t("accessData")}
              </button>
              <button className="text-gray-700 px-8 py-4 rounded-full border border-gray-300 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
                {t("explore")}
              </button>
            </div>

            <a
              href="/home"
              className="mt-4 bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 px-10 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 border-2 border-blue-700 shadow-lg animate-pulse"
            >
              {t("getStarted")}
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {t("aboutTitle")}
            </h2>
            <p className="text-xl text-gray-500 font-light max-w-3xl mx-auto leading-relaxed">
              {t("aboutDescription")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutItems.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-emerald-50 shadow-inner rounded-2xl mb-6 group-hover:shadow-lg transition-all duration-300">
                  <item.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-4 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {t("featuresTitle")}
            </h2>
            <p className="text-xl text-gray-500 font-light">
              {t("featuresSubtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-full bg-gradient-to-br from-blue-50 to-emerald-50 shadow-inner group-hover:shadow-lg transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAYMENT PLANS SECTION */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Payment Plans</h2>
          <p className="text-xl text-gray-500 font-light mb-12">
            Choose the plan that suits your needs. Scale with Medxact.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="bg-green-50 p-8 rounded-3xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group text-left"
              >
                <div className="flex items-center mb-6">
                  <plan.icon className="h-8 w-8 text-emerald-600 mr-4" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {plan.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{plan.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {t("reviewsTitle")}
            </h2>
            <p className="text-xl text-gray-500 font-light">
              {t("reviewsSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 mb-6 border border-gray-100">
                  <div className="flex justify-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic font-light leading-relaxed mb-6">
                    "{review.review}"
                  </p>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {review.name}
                </h4>
                <p className="text-gray-500">{review.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-emerald-100 via-emerald-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {t("ctaTitle")}
          </h2>
          <p className="text-xl text-gray-500 font-light mb-8">
            {t("ctaSubtitle")}
          </p>
          <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold">
            {t("ctaButton")}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-gray-100 text-center">
        <p className="text-gray-500 mb-2">{t("footerDescription")}</p>
        <p className="text-sm text-gray-400">{t("footerRights")}</p>
      </footer>
    </div>
  );
}
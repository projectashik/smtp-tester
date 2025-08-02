"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Send,
  Server,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  type FormState,
  type SMTPConfig,
  SMTPConfigSchema,
  type SMTPProvider,
  SMTPProviders,
  type TestResult,
  TestStatus,
} from "@/types/smtp";

interface SMTPFormProps {
  onTestResult: (result: TestResult) => void;
  onStatusChange: (status: TestStatus) => void;
}

export default function SMTPForm({
  onTestResult,
  onStatusChange,
}: SMTPFormProps) {
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    currentStatus: TestStatus.IDLE,
  });
  const [selectedProvider, setSelectedProvider] =
    useState<SMTPProvider>("CUSTOM");
  const [showPassword, setShowPassword] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SMTPConfig>({
    resolver: zodResolver(SMTPConfigSchema),
    defaultValues: {
      host: "",
      port: 587,
      security: "starttls",
      username: "",
      password: "",
      fromEmail: "",
      fromName: "",
      toEmail: "",
      toName: "",
      subject: "SMTP Test Email",
      message: "This is a test email sent from the SMTP Tester application.",
      isHtml: false,
      timeout: 30000,
      requireAuth: false,
      rejectUnauthorized: true,
    },
  });

  const handleProviderChange = (provider: SMTPProvider) => {
    setSelectedProvider(provider);
    const providerConfig = SMTPProviders[provider];

    setValue("host", providerConfig.host);
    setValue("port", providerConfig.port);
    setValue("security", providerConfig.security);
    setValue("requireAuth", providerConfig.requireAuth);
  };

  const onSubmit = async (data: SMTPConfig) => {
    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
      currentStatus: TestStatus.CONNECTING,
    }));
    onStatusChange(TestStatus.CONNECTING);

    try {
      const response = await fetch("/api/smtp-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success && result.result) {
        setFormState((prev) => ({
          ...prev,
          lastResult: result.result,
          currentStatus: result.result.status,
        }));
        onTestResult(result.result);
        onStatusChange(result.result.status);
      } else {
        setFormState((prev) => ({
          ...prev,
          currentStatus: TestStatus.ERROR,
        }));
        onStatusChange(TestStatus.ERROR);
        if (result.result) {
          onTestResult(result.result);
        }
      }
    } catch (error) {
      console.error("SMTP test failed:", error);
      setFormState((prev) => ({
        ...prev,
        currentStatus: TestStatus.ERROR,
      }));
      onStatusChange(TestStatus.ERROR);
    } finally {
      setFormState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const getStatusIcon = () => {
    switch (formState.currentStatus) {
      case TestStatus.CONNECTING:
      case TestStatus.AUTHENTICATING:
      case TestStatus.SENDING:
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case TestStatus.SUCCESS:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case TestStatus.ERROR:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Mail className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (formState.currentStatus) {
      case TestStatus.CONNECTING:
        return "Connecting to SMTP server...";
      case TestStatus.AUTHENTICATING:
        return "Authenticating...";
      case TestStatus.SENDING:
        return "Sending test email...";
      case TestStatus.SUCCESS:
        return "Test completed successfully!";
      case TestStatus.ERROR:
        return "Test failed";
      default:
        return "Ready to test";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Server className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                SMTP Configuration
              </h2>
              <p className="text-blue-100 text-sm">
                Configure and test your SMTP server settings
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-white text-sm font-medium">
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Provider Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            <Settings className="inline h-4 w-4 mr-2" />
            SMTP Provider
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(SMTPProviders).map(([key, provider]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleProviderChange(key as SMTPProvider)}
                className={`p-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  selectedProvider === key
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {provider.name}
              </button>
            ))}
          </div>
        </div>

        {/* Server Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Server className="inline h-4 w-4 mr-2" />
              SMTP Host *
            </label>
            <input
              {...register("host")}
              type="text"
              placeholder="smtp.example.com"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.host ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.host && (
              <p className="text-red-500 text-xs flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.host.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Port *
            </label>
            <input
              {...register("port", { valueAsNumber: true })}
              type="number"
              min="1"
              max="65535"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.port ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.port && (
              <p className="text-red-500 text-xs flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.port.message}
              </p>
            )}
          </div>
        </div>

        {/* Security & Authentication */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Shield className="inline h-4 w-4 mr-2" />
              Security
            </label>
            <select
              {...register("security")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="none">None</option>
              <option value="starttls">STARTTLS</option>
              <option value="tls">TLS</option>
              <option value="ssl">SSL</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                {...register("requireAuth")}
                type="checkbox"
                id="requireAuth"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="requireAuth"
                className="text-sm font-medium text-gray-700"
              >
                Require Authentication
              </label>
            </div>
          </div>
        </div>

        {/* Authentication Fields */}
        {watch("requireAuth") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <User className="inline h-4 w-4 mr-2" />
                Username
              </label>
              <input
                {...register("username")}
                type="text"
                placeholder="your-username"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Lock className="inline h-4 w-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="your-password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Email Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                From Email *
              </label>
              <input
                {...register("fromEmail")}
                type="email"
                placeholder="sender@example.com"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.fromEmail ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.fromEmail && (
                <p className="text-red-500 text-xs flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.fromEmail.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                From Name
              </label>
              <input
                {...register("fromName")}
                type="text"
                placeholder="Sender Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                To Email *
              </label>
              <input
                {...register("toEmail")}
                type="email"
                placeholder="recipient@example.com"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.toEmail ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.toEmail && (
                <p className="text-red-500 text-xs flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.toEmail.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                To Name
              </label>
              <input
                {...register("toName")}
                type="text"
                placeholder="Recipient Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Subject *
            </label>
            <input
              {...register("subject")}
              type="text"
              placeholder="Test Email Subject"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.subject ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.subject && (
              <p className="text-red-500 text-xs flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.subject.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Message *
              </label>
              <div className="flex items-center space-x-2">
                <input
                  {...register("isHtml")}
                  type="checkbox"
                  id="isHtml"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isHtml" className="text-sm text-gray-600">
                  HTML Format
                </label>
              </div>
            </div>
            <textarea
              {...register("message")}
              rows={4}
              placeholder="Enter your test message here..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical ${
                errors.message ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.message && (
              <p className="text-red-500 text-xs flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.message.message}
              </p>
            )}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Advanced Settings</span>
            <span
              className={`transform transition-transform ${
                showAdvanced ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Timeout (ms)
                </label>
                <input
                  {...register("timeout", { valueAsNumber: true })}
                  type="number"
                  min="1000"
                  max="60000"
                  step="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    {...register("rejectUnauthorized")}
                    type="checkbox"
                    id="rejectUnauthorized"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="rejectUnauthorized"
                    className="text-sm font-medium text-gray-700"
                  >
                    Reject Unauthorized Certificates
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {formState.isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Test SMTP Connection</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              reset();
              setSelectedProvider("CUSTOM");
              setFormState({
                isSubmitting: false,
                currentStatus: TestStatus.IDLE,
              });
              onStatusChange(TestStatus.IDLE);
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

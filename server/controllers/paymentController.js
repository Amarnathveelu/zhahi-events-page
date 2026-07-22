import Razorpay from "razorpay";
import crypto from "crypto";
import Enrollment from "../models/Enrollment.js";

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are not configured in .env");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

export const createOrder = async (req, res) => {
  try {
    const { amount, enrollmentId } = req.body;
    if (!amount || !enrollmentId) {
      return res.status(400).json({ message: "amount and enrollmentId are required." });
    }

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found." });
    }

    // Always trust the fee stored server-side, not whatever the client sends.
    const amountInPaise = Math.round(enrollment.fee * 100);

    const instance = getRazorpayInstance();
    const order = await instance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `enroll_${enrollment._id}`,
      notes: {
        enrollmentId: String(enrollment._id),
        competition: enrollment.competitionTitle,
      },
    });

    enrollment.razorpayOrderId = order.id;
    await enrollment.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Could not create payment order." });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { enrollmentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!enrollmentId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment verification fields." });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await Enrollment.findByIdAndUpdate(enrollmentId, { paymentStatus: "failed" });
      return res.status(400).json({ message: "Payment signature verification failed." });
    }

    const enrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      {
        paymentStatus: "paid",
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    res.json({ message: "Payment verified successfully.", enrollment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during payment verification." });
  }
};

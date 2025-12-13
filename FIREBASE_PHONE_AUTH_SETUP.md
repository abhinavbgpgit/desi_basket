# Firebase Phone Authentication Setup Guide

## Current Issue: auth/billing-not-enabled

Firebase Phone Authentication requires a **Blaze (Pay-as-you-go) plan** for production use. However, you have two options:

---

## Option 1: Use Test Phone Numbers (FREE - Recommended for Development)

Firebase allows you to add test phone numbers that work without billing. Perfect for development!

### Steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **desi-basket-auth**
3. Navigate to **Authentication** → **Sign-in method**
4. Scroll down to **Phone** section
5. Click on **Phone numbers for testing**
6. Add test phone numbers with their verification codes:
   - Phone: `+919876543210` → Code: `123456`
   - Phone: `+919999999999` → Code: `654321`
   - Add more as needed

### How to Use:
- Enter the test phone number in your app
- Firebase will NOT send a real SMS
- Use the pre-configured verification code (e.g., `123456`)
- This works on the FREE Spark plan!

---

## Option 2: Upgrade to Blaze Plan (For Production)

If you need to send real SMS to actual phone numbers:

### Steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **desi-basket-auth**
3. Click on **Upgrade** in the left sidebar
4. Select **Blaze (Pay as you go)** plan
5. Add billing information

### Pricing:
- Phone Authentication: **FREE** for first 10K verifications/month
- After that: $0.01 per verification
- You can set budget alerts to control costs

### Important Notes:
- You'll need a credit/debit card
- Set up budget alerts in Google Cloud Console
- Most small apps stay within the free tier

---

## Recommended Approach for Your Project

### For Development (Now):
✅ Use **Test Phone Numbers** (Option 1)
- No billing required
- Works immediately
- Perfect for testing

### For Production (Later):
✅ Upgrade to **Blaze Plan** (Option 2)
- Enable real SMS sending
- Set budget alerts
- Monitor usage

---

## Alternative: Use Email/Password Authentication (FREE)

If you want to avoid phone authentication complexity, you can use Email/Password authentication which is completely FREE:

1. Enable Email/Password in Firebase Console
2. Update your Auth.jsx to use email instead of phone
3. No billing required ever

---

## Next Steps

1. **For immediate testing**: Add test phone numbers in Firebase Console
2. **Test with**: `+919876543210` and code `123456`
3. **For production**: Upgrade to Blaze plan when ready to launch

---

## Support

If you need help with any of these options, let me know!
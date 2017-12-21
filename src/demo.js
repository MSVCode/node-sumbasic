var titles = [
    "Google is urging more manufacturers to enable a new security feature in Android Oreo that detects if a device has been downgraded to an earlier version of the OS. Known as rollback protection, the measure adds another layer of security in the event a device is lost or stolen, and the attacker rolls it back to an older Android firmware with known vulnerabilities. Google revealed some details about rollback protection in September, which caught the attention of Android enthusiasts who like the freedom to downgrade Android as they see fit, even though it could be a security risk. While the security feature is part of Oreo, it's not available on every Android device that runs Oreo. According to Google, rollback protection works in tandem with Project Treble, the major redesign of Android in Oreo that separates the Android platform from vendor code. The modular design aims to help Android OEMs deliver new versions of Android to end-users faster. However, Project Treble is only supported on new devices that ship with Android, rather than devices that get upgraded to Oreo. So new handsets like the Pixel 2 and Sony Xperia XZ1 are Treble-compatible, while the Nokia 8 isn't.",
    'Security has long been a sore point for enterprise Android users, but Google has taken steps to improve security in the OS with Android Oreo. In a Wednesday blog post, the firm detailed a feature called rollback protection, which prevents a device from starting up if it has been downgraded to an older OS version that may contain security vulnerabilities. This means that if your business phone is stolen, it will be more difficult for a hacker to leverage security flaws found in a previous version of the OS and access your data. This could add piece of mind for IT professionals managing Android devices in the workplace. While rollback protection is part of Android Oreo, it is up to the individual manufacturers of Android devices to enable the feature, as noted by our sister site ZDNet. Rollback protection is part of Andriod Verified Boot 2.0 (AVB), designed to stop devices from starting up with software that has been altered by hackers, according to the blog post from security team member Gian G. Spicuzza. AVB runs with Project Treble, a "major re-architect" of the Android OS framework meant to make it easier for manufacturers to update to new versions of the OS.',
    "Since Android Oreo was made available to Pixel and Nexus devices, Google has been working to harden the security of the mobile platform. Today, the company announced some of the improvements they made in the security department throughout the last few months. Some of these security features have already been implemented like making it safer to get apps and dropping insecure network protocol, while others may be released in the not so distant future. Google confirmed that it's expanding support for hardware security, which means they have added a reference implementation for Verified Boot running with Project Treble. Verified Boot is a special security feature that's been designed to prevent devices from booting up with software that has been tampered with. The improved security implementation is called Android Verified Boot 2.0 (AVB) and offers some nifty features that should allow for easier updates and more security, including rollback protection. The latter will prevent a device to boot if downgraded to an older OS version that might be vulnerable to an exploit. Then, Android Oreo now features the new OEM Lock Hardware Abstraction Layer (HAL), which should offer device manufacturers more flexibility for how they protect in case a device is locked, unlocked, or unlockable. There are many other under the hood security improvements Google implemented into Android Oreo, so make sure to hit the source link for the full list."
];

var summary = require('./index');
console.log(summary(titles,50));
var i=0;
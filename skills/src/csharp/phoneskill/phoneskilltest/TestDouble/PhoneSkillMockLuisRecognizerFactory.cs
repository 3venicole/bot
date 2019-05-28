﻿using System.Collections.Generic;
using Luis;
using Microsoft.Bot.Builder.Solutions.Testing.Mocks;
using PhoneSkill.Services.Luis;
using PhoneSkillTest.Flow.Utterances;

namespace PhoneSkillTest.TestDouble
{
    public class PhoneSkillMockLuisRecognizerFactory
    {
        public static MockLuisRecognizer CreateMockGeneralLuisRecognizer()
        {
            var builder = new MockLuisRecognizerBuilder<General, General.Intent>();

            builder.AddUtterance(GeneralUtterances.Cancel, General.Intent.Cancel);
            builder.AddUtterance(GeneralUtterances.Escalate, General.Intent.Escalate);
            builder.AddUtterance(GeneralUtterances.Help, General.Intent.Help);
            builder.AddUtterance(GeneralUtterances.Incomprehensible, General.Intent.None);
            builder.AddUtterance(GeneralUtterances.Logout, General.Intent.Logout);

            return builder.Build();
        }

        public static MockLuisRecognizer CreateMockPhoneLuisRecognizer()
        {
            var builder = new MockLuisRecognizerBuilder<PhoneLuis, PhoneLuis.Intent>();

            builder.AddUtterance(GeneralUtterances.Incomprehensible, PhoneLuis.Intent.None);

            builder.AddUtterance(OutgoingCallUtterances.OutgoingCallContactName, PhoneLuis.Intent.OutgoingCall, new List<MockLuisEntity>()
            {
                new MockLuisEntity
                {
                    Type = "contactName",
                    Text = "bob",
                    StartIndex = 5,
                },
            });

            builder.AddUtterance(OutgoingCallUtterances.OutgoingCallContactNameMultipleMatches, PhoneLuis.Intent.OutgoingCall, new List<MockLuisEntity>()
            {
                new MockLuisEntity
                {
                    Type = "contactName",
                    Text = "narthwani",
                    StartIndex = 5,
                },
            });

            builder.AddUtterance(OutgoingCallUtterances.OutgoingCallContactNameMultipleNumbers, PhoneLuis.Intent.OutgoingCall, new List<MockLuisEntity>()
            {
                new MockLuisEntity
                {
                    Type = "contactName",
                    Text = "andrew smith",
                    StartIndex = 5,
                },
            });

            builder.AddUtterance(OutgoingCallUtterances.OutgoingCallContactNameMultipleNumbersWithSameType, PhoneLuis.Intent.OutgoingCall, new List<MockLuisEntity>()
            {
                new MockLuisEntity
                {
                    Type = "contactName",
                    Text = "eve smith",
                    StartIndex = 5,
                },
            });

            builder.AddUtterance(OutgoingCallUtterances.OutgoingCallNoEntities, PhoneLuis.Intent.OutgoingCall);

            builder.AddUtterance(OutgoingCallUtterances.OutgoingCallPhoneNumber, PhoneLuis.Intent.OutgoingCall, new List<MockLuisEntity>()
            {
                new MockLuisEntity
                {
                    Type = "phoneNumber",
                    Text = "0118 999 88199 9119 725 3",
                    StartIndex = 5,
                },
            });

            builder.AddUtterance(OutgoingCallUtterances.RecipientContactName, PhoneLuis.Intent.OutgoingCall, new List<MockLuisEntity>()
            {
                new MockLuisEntity
                {
                    Type = "contactName",
                    Text = "bob",
                    StartIndex = 0,
                },
            });

            builder.AddUtterance(OutgoingCallUtterances.RecipientPhoneNumber, PhoneLuis.Intent.OutgoingCall, new List<MockLuisEntity>()
            {
                new MockLuisEntity
                {
                    Type = "phoneNumber",
                    Text = "0118 999 88199 9119 725 3",
                    StartIndex = 0,
                },
            });

            return builder.Build();
        }

        public static MockLuisRecognizer CreateMockContactSelectionLuisRecognizer()
        {
            var builder = new MockLuisRecognizerBuilder<ContactSelectionLuis, ContactSelectionLuis.Intent>();

            builder.AddUtterance(OutgoingCallUtterances.ContactSelectionFullName, ContactSelectionLuis.Intent.ContactSelection, new List<MockLuisEntity>()
            {
                new MockLuisEntity
                {
                    Type = "contactName",
                    Text = "sanjay narthwani",
                    StartIndex = 7,
                },
            });

            builder.AddUtterance(OutgoingCallUtterances.ContactSelectionPartialName, ContactSelectionLuis.Intent.ContactSelection, new List<MockLuisEntity>()
            {
                new MockLuisEntity
                {
                    Type = "contactName",
                    Text = "sanjay",
                    StartIndex = 7,
                },
            });

            builder.AddUtterance(OutgoingCallUtterances.SelectionFirst, ContactSelectionLuis.Intent.ContactSelection);

            return builder.Build();
        }

        public static MockLuisRecognizer CreateMockPhoneNumberSelectionLuisRecognizer()
        {
            var builder = new MockLuisRecognizerBuilder<PhoneNumberSelectionLuis, PhoneNumberSelectionLuis.Intent>();

            builder.AddUtterance(OutgoingCallUtterances.PhoneNumberSelectionStandardizedType, PhoneNumberSelectionLuis.Intent.PhoneNumberSelection, new List<MockLuisEntity>()
            {
                new MockLuisEntity
                {
                    Type = "phoneNumberType",
                    Text = "mobile",
                    StartIndex = 9,
                    ResolvedValue = "MOBILE",
                },
            });

            builder.AddUtterance(OutgoingCallUtterances.SelectionFirst, PhoneNumberSelectionLuis.Intent.PhoneNumberSelection);

            return builder.Build();
        }
    }
}
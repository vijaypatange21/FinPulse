from django.contrib import admin

from .models import (
    BankSummaryDim,
    BankTransactionFact,
    BorrowerProfile,
    DerivedSignalsDim,
    GSTMonthlyFact,
    ITRProfile,
    LenderProfile,
    LoanApplication,
    LoanRegisterFact,
    LoanSummaryDim,
    BorrowerDocument,
    LenderDocument,
    MasterMLTrainingTable,
    Notification,
    User,
)

admin.site.register(User)
admin.site.register(BorrowerProfile)
admin.site.register(LenderProfile)
admin.site.register(LoanApplication)
admin.site.register(BorrowerDocument)
admin.site.register(LenderDocument)
admin.site.register(Notification)
admin.site.register(ITRProfile)
admin.site.register(GSTMonthlyFact)
admin.site.register(BankTransactionFact)
admin.site.register(LoanRegisterFact)
admin.site.register(BankSummaryDim)
admin.site.register(LoanSummaryDim)
admin.site.register(DerivedSignalsDim)
admin.site.register(MasterMLTrainingTable)

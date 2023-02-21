-- CreateTable
CREATE TABLE "PaymentMethod" (
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "card_number" TEXT NOT NULL,
    "owner_code" TEXT NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Card" (
    "owner_name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "card_number" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "cvv" TEXT NOT NULL,
    "expiry" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Owner" (
    "owner_code" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("owner_code")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "owner_code" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("owner_code")
);

-- CreateTable
CREATE TABLE "CustomPaymentMethod" (
    "owner_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CustomPaymentMethod_pkey" PRIMARY KEY ("owner_code","name")
);

-- CreateTable
CREATE TABLE "CustomInfo" (
    "title" TEXT NOT NULL,
    "info" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CustomInfoOnCustomPaymentMethods" (
    "name_custom_payment_method" TEXT NOT NULL,
    "title_custom_info" TEXT NOT NULL,
    "owner_code" TEXT NOT NULL,

    CONSTRAINT "CustomInfoOnCustomPaymentMethods_pkey" PRIMARY KEY ("name_custom_payment_method","title_custom_info","owner_code")
);

-- CreateTable
CREATE TABLE "CustomDocument" (
    "owner_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CustomDocument_pkey" PRIMARY KEY ("owner_code","name")
);

-- CreateTable
CREATE TABLE "CustomInfoOnCustomDocuments" (
    "title_custom_info" TEXT NOT NULL,
    "custom_document_name" TEXT NOT NULL,
    "customPaymentMethodName" TEXT,
    "owner_code" TEXT NOT NULL,

    CONSTRAINT "CustomInfoOnCustomDocuments_pkey" PRIMARY KEY ("custom_document_name","title_custom_info","owner_code")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_name_key" ON "PaymentMethod"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_card_number_key" ON "PaymentMethod"("card_number");

-- CreateIndex
CREATE UNIQUE INDEX "Card_card_number_key" ON "Card"("card_number");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_owner_code_key" ON "Wallet"("owner_code");

-- CreateIndex
CREATE UNIQUE INDEX "CustomPaymentMethod_name_key" ON "CustomPaymentMethod"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CustomInfo_title_key" ON "CustomInfo"("title");

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_card_number_fkey" FOREIGN KEY ("card_number") REFERENCES "Card"("card_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_owner_code_fkey" FOREIGN KEY ("owner_code") REFERENCES "Owner"("owner_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomPaymentMethod" ADD CONSTRAINT "CustomPaymentMethod_owner_code_fkey" FOREIGN KEY ("owner_code") REFERENCES "Wallet"("owner_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomInfoOnCustomPaymentMethods" ADD CONSTRAINT "CustomInfoOnCustomPaymentMethods_name_custom_payment_metho_fkey" FOREIGN KEY ("name_custom_payment_method", "owner_code") REFERENCES "CustomPaymentMethod"("name", "owner_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomInfoOnCustomPaymentMethods" ADD CONSTRAINT "CustomInfoOnCustomPaymentMethods_title_custom_info_fkey" FOREIGN KEY ("title_custom_info") REFERENCES "CustomInfo"("title") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomInfoOnCustomPaymentMethods" ADD CONSTRAINT "CustomInfoOnCustomPaymentMethods_owner_code_fkey" FOREIGN KEY ("owner_code") REFERENCES "Owner"("owner_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomDocument" ADD CONSTRAINT "CustomDocument_owner_code_fkey" FOREIGN KEY ("owner_code") REFERENCES "Wallet"("owner_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomInfoOnCustomDocuments" ADD CONSTRAINT "CustomInfoOnCustomDocuments_title_custom_info_fkey" FOREIGN KEY ("title_custom_info") REFERENCES "CustomInfo"("title") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomInfoOnCustomDocuments" ADD CONSTRAINT "CustomInfoOnCustomDocuments_custom_document_name_owner_cod_fkey" FOREIGN KEY ("custom_document_name", "owner_code") REFERENCES "CustomDocument"("name", "owner_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomInfoOnCustomDocuments" ADD CONSTRAINT "CustomInfoOnCustomDocuments_customPaymentMethodName_fkey" FOREIGN KEY ("customPaymentMethodName") REFERENCES "CustomPaymentMethod"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomInfoOnCustomDocuments" ADD CONSTRAINT "CustomInfoOnCustomDocuments_owner_code_fkey" FOREIGN KEY ("owner_code") REFERENCES "Owner"("owner_code") ON DELETE RESTRICT ON UPDATE CASCADE;

// src/app/assets-liabilities/page.tsx
"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/lib/fetcher";
import {
  ArrowLeft, Wallet, ShieldAlert, HeartPulse, Briefcase, Activity, Check, Plus, Trash2, Edit3, Link as LinkIcon, AlertTriangle, ShieldCheck, RefreshCw, BarChart3, HelpCircle, Save, Info
} from "lucide-react";

type ActiveTab = "overview" | "assets" | "liabilities" | "protection";

// Constants for Mock Gold & Silver rates (as approved)
const GOLD_RATES = {
  "24K": 7200,
  "22K": 6600,
  "18K": 5400
};
const SILVER_RATE = 90; // per gram

export default function AssetsLiabilitiesPage() {
  const { data: portfolioRes, mutate: mutatePortfolio } = useSWR<any>("/api/assets-liabilities", fetcher);
  const { data: profileRes } = useSWR<any>("/api/profile", fetcher);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  
  // Local editable state for the portfolio
  const [portfolio, setPortfolio] = useState<any>(null);

  // Sync database state to local editable state when SWR returns data
  useEffect(() => {
    if (portfolioRes?.success && portfolioRes?.portfolio) {
      setPortfolio(JSON.parse(JSON.stringify(portfolioRes.portfolio)));
    }
  }, [portfolioRes]);

  if (!portfolio) {
    return (
      <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", color: "#0055EE" }}>
        <div style={{ width: 280, height: 2, background: "#eef1f8", borderRadius: 2, overflow: "hidden", marginBottom: 18 }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg,#0055EE,#4499FF)", width: "40%", borderRadius: 2, animation: "ldbar 1.6s infinite ease-in-out" }} />
        </div>
        <div style={{ fontSize: 11, letterSpacing: "0.4em", textTransform: "uppercase", color: "#7788aa", fontWeight: 700 }}>Connecting wealth ledger…</div>
        <style>{`@keyframes ldbar{0%{margin-left:-40%}100%{margin-left:140%}}`}</style>
      </div>
    );
  }

  // Monthly income baseline from profile (fallbacks to ₹60,000)
  const monthlyIncome = profileRes?.user?.profile?.monthlyIncome || 60000;

  // Helper to safely update nested fields in local state
  const setNestedField = (path: string[], value: any) => {
    setPortfolio((prev: any) => {
      const next = { ...prev };
      let current = next;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return next;
    });
  };

  /* ===================================================================
     1. MATHEMATICAL CALCULATION ENGINE
     =================================================================== */

  // ASSETS
  const liquid = portfolio.assets?.liquid || {};
  const savingsAccountsTotal = (liquid.savingsAccounts || []).reduce((sum: number, a: any) => sum + (Number(a.balance) || 0), 0);
  const fixedDepositsTotal = (liquid.fixedDeposits || []).reduce((sum: number, fd: any) => sum + (Number(fd.principal) || 0), 0);
  const recurringDepositsTotal = (liquid.recurringDeposits || []).reduce((sum: number, rd: any) => sum + (Number(rd.investedSoFar) || 0), 0);
  const cashInHand = Number(liquid.cashInHand) || 0;
  const digitalWallets = Number(liquid.digitalWallets) || 0;
  const totalLiquidAssets = savingsAccountsTotal + fixedDepositsTotal + recurringDepositsTotal + cashInHand + digitalWallets;

  const investments = portfolio.assets?.investments || {};
  const stocksCurrent = Number(investments.stocks?.currentValue) || 0;
  const stocksInvested = Number(investments.stocks?.investedAmount) || 0;
  const stocksPnL = stocksCurrent - stocksInvested;
  
  const mutualFundsCurrent = (investments.mutualFunds || []).reduce((sum: number, mf: any) => sum + (Number(mf.currentValue) || 0), 0);
  const mutualFundsInvested = (investments.mutualFunds || []).reduce((sum: number, mf: any) => sum + (Number(mf.investedAmount) || 0), 0);
  const mutualFundsPnL = mutualFundsCurrent - mutualFundsInvested;

  const ppfCorpus = Number(investments.ppf?.corpus) || 0;
  const epfCorpus = Number(investments.epf?.corpus) || 0;
  const npsCorpus = Number(investments.nps?.corpus) || 0;
  const sgbBondsTotal = (investments.sgbBonds || []).reduce((sum: number, b: any) => sum + (Number(b.currentValue) || 0), 0);
  
  const usStocksUSD = Number(investments.usStocks?.currentValueUSD) || 0;
  const usStocksRate = Number(investments.usStocks?.exchangeRate) || 83.5;
  const usStocksTotal = usStocksUSD * usStocksRate;

  const totalInvestments = stocksCurrent + mutualFundsCurrent + ppfCorpus + epfCorpus + npsCorpus + sgbBondsTotal + usStocksTotal;

  const physical = portfolio.assets?.physical || {};
  const propertiesTotal = (physical.properties || []).reduce((sum: number, p: any) => sum + (Number(p.estimatedValue) || 0), 0);
  const vehiclesTotal = (physical.vehicles || []).reduce((sum: number, v: any) => sum + (Number(v.estimatedValue) || 0), 0);
  
  // Gold estimated value: auto-calculated based on mock stable rates
  const goldWeight = Number(physical.goldJewellery?.weightGrams) || 0;
  const goldPurity = (physical.goldJewellery?.purity || "22K") as "24K" | "22K" | "18K";
  const goldRate = GOLD_RATES[goldPurity] || 6600;
  const goldCalculated = goldWeight * goldRate;
  
  // Silver estimated value: auto-calculated
  const silverWeight = Number(physical.silverMetals?.weightGrams) || 0;
  const silverCalculated = silverWeight * SILVER_RATE;

  const collectiblesTotal = (physical.collectibles || []).reduce((sum: number, c: any) => sum + (Number(c.estimatedValue) || 0), 0);
  const totalPhysicalAssets = propertiesTotal + vehiclesTotal + goldCalculated + silverCalculated + collectiblesTotal;

  const otherAssets = portfolio.assets?.other || {};
  const businessOwnershipTotal = (otherAssets.businessOwnership || []).reduce((sum: number, b: any) => sum + (Number(b.estimatedValue) || 0), 0);
  const loansGivenTotal = (otherAssets.loansGiven || []).reduce((sum: number, l: any) => sum + (Number(l.amountLent) || 0), 0);
  const previousGratuity = Number(otherAssets.previousGratuity) || 0;
  const endowmentSurrenderTotal = (portfolio.protection?.endowmentPolicies || []).reduce((sum: number, p: any) => sum + (Number(p.surrenderValue) || 0), 0);
  const totalOtherAssets = businessOwnershipTotal + loansGivenTotal + previousGratuity + endowmentSurrenderTotal;

  const totalAssets = totalLiquidAssets + totalInvestments + totalPhysicalAssets + totalOtherAssets;

  // LIABILITIES
  const shortTerm = portfolio.liabilities?.shortTerm || {};
  const creditCardsTotal = (shortTerm.creditCards || []).reduce((sum: number, c: any) => sum + (Number(c.outstanding) || 0), 0);
  const bnplTotal = (shortTerm.bnpl || []).reduce((sum: number, b: any) => sum + (Number(b.outstanding) || 0), 0);
  const personalLoansTotal = (shortTerm.personalLoans || []).reduce((sum: number, p: any) => sum + (Number(p.outstanding) || 0), 0);
  const informalLoansTotal = (shortTerm.informalLoans || []).reduce((sum: number, i: any) => sum + (Number(i.outstanding) || 0), 0);
  const totalShortTermLiabilities = creditCardsTotal + bnplTotal + personalLoansTotal + informalLoansTotal;

  const longTerm = portfolio.liabilities?.longTerm || {};
  const homeLoansTotal = (longTerm.homeLoans || []).reduce((sum: number, h: any) => sum + (Number(h.outstanding) || 0), 0);
  const carLoansTotal = (longTerm.carLoans || []).reduce((sum: number, c: any) => sum + (Number(c.outstanding) || 0), 0);
  const educationLoansTotal = (longTerm.educationLoans || []).reduce((sum: number, e: any) => sum + (Number(e.outstanding) || 0), 0);
  const businessLoansTotal = (longTerm.businessLoans || []).reduce((sum: number, b: any) => sum + (Number(b.outstanding) || 0), 0);
  const loansAgainstPropertyTotal = (longTerm.loansAgainstProperty || []).reduce((sum: number, l: any) => sum + (Number(l.outstanding) || 0), 0);
  const goldLoansTotal = (longTerm.goldLoans || []).reduce((sum: number, g: any) => sum + (Number(g.outstanding) || 0), 0);
  const totalLongTermLiabilities = homeLoansTotal + carLoansTotal + educationLoansTotal + businessLoansTotal + loansAgainstPropertyTotal + goldLoansTotal;

  const pendingTaxDues = Number(portfolio.liabilities?.pendingTaxDues) || 0;
  const legalDisputesTotal = (portfolio.liabilities?.legalDisputes || []).reduce((sum: number, l: any) => sum + (Number(l.exposureAmount) || 0), 0);

  const totalLiabilities = totalShortTermLiabilities + totalLongTermLiabilities + pendingTaxDues;

  // NET WORTH SUMMARY
  const netWorth = totalAssets - totalLiabilities;
  const liquidNetWorth = totalLiquidAssets - totalShortTermLiabilities;
  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

  // Monthly EMIs
  const personalLoansEMI = (shortTerm.personalLoans || []).reduce((sum: number, p: any) => sum + (Number(p.emi) || 0), 0);
  const homeLoansEMI = (longTerm.homeLoans || []).reduce((sum: number, h: any) => sum + (Number(h.emi) || 0), 0);
  const carLoansEMI = (longTerm.carLoans || []).reduce((sum: number, c: any) => sum + (Number(c.emi) || 0), 0);
  const educationLoansEMI = (longTerm.educationLoans || []).reduce((sum: number, e: any) => sum + (Number(e.emi) || 0), 0);
  const businessLoansEMI = (longTerm.businessLoans || []).reduce((sum: number, b: any) => sum + (Number(b.emi) || 0), 0);
  const lapLoansEMI = (longTerm.loansAgainstProperty || []).reduce((sum: number, l: any) => sum + (Number(l.emi) || 0), 0);
  
  const termInsurancePremiumMonthly = (portfolio.protection?.termInsurance || []).reduce((sum: number, p: any) => sum + (Number(p.annualPremium) || 0), 0) / 12;
  const endowmentPremiumMonthly = (portfolio.protection?.endowmentPolicies || []).reduce((sum: number, p: any) => sum + (Number(p.annualPremium) || 0), 0) / 12;

  const totalMonthlyEMIs = personalLoansEMI + homeLoansEMI + carLoansEMI + educationLoansEMI + businessLoansEMI + lapLoansEMI + termInsurancePremiumMonthly + endowmentPremiumMonthly;
  const emiBurdenPct = monthlyIncome > 0 ? (totalMonthlyEMIs / monthlyIncome) * 100 : 0;

  // Contingent liability risks
  const contingentTotal = (portfolio.liabilities?.contingent || []).reduce((sum: number, c: any) => sum + (Number(c.exposureAmount) || 0), 0);

  // Asset allocation percentages
  const liquidPct = totalAssets > 0 ? (totalLiquidAssets / totalAssets) * 100 : 0;
  const investPct = totalAssets > 0 ? (totalInvestments / totalAssets) * 100 : 0;
  const physicalPct = totalAssets > 0 ? (totalPhysicalAssets / totalAssets) * 100 : 0;
  const otherPct = totalAssets > 0 ? (totalOtherAssets / totalAssets) * 100 : 0;

  /* ===================================================================
     2. PROPERTY & VEHICLE LINKED ASSET EQUITY COMPUTATION
     =================================================================== */
  
  // Calculate property outstanding loans
  const getPropertyNetEquity = (propId: string, propValue: number) => {
    const linkedHomeLoans = (longTerm.homeLoans || []).filter((h: any) => h.linkedAssetId === propId).reduce((sum: number, h: any) => sum + (Number(h.outstanding) || 0), 0);
    const linkedLapLoans = (longTerm.loansAgainstProperty || []).filter((l: any) => l.linkedAssetId === propId).reduce((sum: number, l: any) => sum + (Number(l.outstanding) || 0), 0);
    const outstandingDebt = linkedHomeLoans + linkedLapLoans;
    return {
      debt: outstandingDebt,
      equity: propValue - outstandingDebt,
      pct: propValue > 0 ? ((propValue - outstandingDebt) / propValue) * 100 : 0
    };
  };

  // Calculate vehicle outstanding loans
  const getVehicleNetEquity = (vehicleId: string, vehicleValue: number) => {
    const outstandingDebt = (longTerm.carLoans || []).filter((c: any) => c.linkedAssetId === vehicleId).reduce((sum: number, c: any) => sum + (Number(c.outstanding) || 0), 0);
    return {
      debt: outstandingDebt,
      equity: vehicleValue - outstandingDebt,
      pct: vehicleValue > 0 ? ((vehicleValue - outstandingDebt) / vehicleValue) * 100 : 0
    };
  };

  /* ===================================================================
     3. SAVE ACTION
     =================================================================== */
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // Sync gold jewellery custom estimated value based on weight & purity rate prior to save
      const calculatedGoldValue = goldWeight * goldRate;
      const updatedPortfolio = {
        ...portfolio,
        assets: {
          ...portfolio.assets,
          physical: {
            ...portfolio.assets.physical,
            goldJewellery: {
              ...portfolio.assets.physical.goldJewellery,
              estimatedValue: calculatedGoldValue
            },
            silverMetals: {
              ...portfolio.assets.physical.silverMetals,
              estimatedValue: silverWeight * SILVER_RATE
            }
          }
        }
      };

      const res = await fetch("/api/assets-liabilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio: updatedPortfolio }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save portfolio.");
      
      mutatePortfolio(data);
      setMessage({ text: "Neural wealth ledger synced successfully!", type: "success" });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to save data.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="networth-root">
      <style>{CSS}</style>
      
      <div className="networth-page">
        {/* BACK NAVIGATION */}
        <div className="back-bar">
          <Link href="/dashboard" className="back-btn">
            <ArrowLeft size={13}/> Return to Dashboard
          </Link>
          <span className="back-bar-brand">SYN<span>TRA</span></span>
        </div>

        {/* PAGE HEADING */}
        <div className="page-heading-block">
          <div className="page-eyebrow">
            <div className="eyebrow-dot"/>
            <span className="eyebrow-text">Wealth Architecture</span>
          </div>
          <h1 className="page-title">Assets &amp; Liabilities</h1>
          <p className="page-subtitle">
            Configure your entire financial twin. Syntra maps savings, direct equity, physical properties, long-term loans, and protection layers to calculate real equity, liquidity ratios, and overall net worth.
          </p>
        </div>

        {/* FEEDBACK NOTICE */}
        {message && (
          <div className={`msg-box ${message.type}`}>
            {message.type === "success" ? <ShieldCheck size={16}/> : <AlertTriangle size={16}/>}
            {message.text}
          </div>
        )}

        {/* PINNED NET WORTH SUMMARIES */}
        <div className="summaries-grid">
          <div className="summary-card net-worth-card">
            <div className="sc-label">Net Worth</div>
            <div className="sc-value">₹{netWorth.toLocaleString("en-IN")}</div>
            <div className="sc-footer">Total Assets minus Total Liabilities</div>
          </div>
          <div className="summary-card liquid-nw-card">
            <div className="sc-label">Liquid Net Worth</div>
            <div className="sc-value" style={{ color: liquidNetWorth >= 0 ? "#10b981" : "#ef4444" }}>
              ₹{liquidNetWorth.toLocaleString("en-IN")}
            </div>
            <div className="sc-footer">Cash/Investments minus Short-term Debt</div>
          </div>
          <div className="summary-card emi-card">
            <div className="sc-label">Monthly EMI Burden</div>
            <div className="sc-value" style={{ color: emiBurdenPct > 40 ? "#d97706" : "#0055EE" }}>
              ₹{Math.round(totalMonthlyEMIs).toLocaleString("en-IN")}
            </div>
            <div className="sc-footer">
              <span className={`badge ${emiBurdenPct > 40 ? "warn" : "info"}`}>
                {emiBurdenPct.toFixed(1)}% of Income
              </span>
            </div>
          </div>
          <div className="summary-card leverage-card">
            <div className="sc-label">Debt-to-Asset Ratio</div>
            <div className="sc-value">{debtToAssetRatio.toFixed(1)}%</div>
            <div className="sc-footer">
              <span className={`badge ${debtToAssetRatio > 50 ? "danger" : "success"}`}>
                {debtToAssetRatio > 50 ? "High Leverage" : "Healthy Leverage"}
              </span>
            </div>
          </div>
        </div>

        {/* TAB CONTROLS */}
        <div className="tabs-container">
          {(["overview", "assets", "liabilities", "protection"] as ActiveTab[]).map(t => (
            <button 
              key={t} 
              className={`tab-btn ${activeTab === t ? "active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
          <button className="save-btn-sticky" onClick={handleSave} disabled={saving}>
            {saving ? <RefreshCw size={14} className="spin"/> : <Save size={14}/>}
            {saving ? "Syncing..." : "Sync Portfolio"}
          </button>
        </div>

        {/* ===================================================================
           TAB: OVERVIEW
           =================================================================== */}
        {activeTab === "overview" && (
          <div className="overview-tab-content">
            <div className="overview-grid">
              
              {/* Asset Allocation Card */}
              <div className="card">
                <div className="card-stripe" style={{ background: "#0055EE" }}/>
                <div className="card-body">
                  <div className="card-head-title" style={{ marginBottom: 20 }}>Asset Allocation Breakdown</div>
                  
                  <div className="allocation-list">
                    <div className="allocation-row">
                      <div className="row-info">
                        <strong>Liquid Assets</strong>
                        <span>₹{totalLiquidAssets.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{ width: `${liquidPct}%`, background: "#3b82f6" }}/></div>
                      <div className="row-pct">{liquidPct.toFixed(1)}% (Immediate Liquidity)</div>
                    </div>

                    <div className="allocation-row">
                      <div className="row-info">
                        <strong>Investments</strong>
                        <span>₹{totalInvestments.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{ width: `${investPct}%`, background: "#059669" }}/></div>
                      <div className="row-pct">{investPct.toFixed(1)}% (Wealth Multipliers)</div>
                    </div>

                    <div className="allocation-row">
                      <div className="row-info">
                        <strong>Physical Assets</strong>
                        <span>₹{totalPhysicalAssets.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{ width: `${physicalPct}%`, background: "#d97706" }}/></div>
                      <div className="row-pct">{physicalPct.toFixed(1)}% (Real Estate, Gold &amp; Vehicles)</div>
                    </div>

                    <div className="allocation-row">
                      <div className="row-info">
                        <strong>Other Receivables</strong>
                        <span>₹{totalOtherAssets.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{ width: `${otherPct}%`, background: "#7c3aed" }}/></div>
                      <div className="row-pct">{otherPct.toFixed(1)}% (Business, Surrenders, Loans Given)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Net Equity in Assets */}
              <div className="card">
                <div className="card-stripe" style={{ background: "#10b981" }}/>
                <div className="card-body">
                  <div className="card-head-title" style={{ marginBottom: 14 }}>Real Net Equity in Properties &amp; Vehicles</div>
                  <p className="card-sub-info" style={{ marginBottom: 20 }}>Syntra links your home/car loans to compute real equity value (Estimated Value minus Outstanding Debt).</p>
                  
                  <div className="equity-list">
                    {/* properties */}
                    {physical.properties?.length === 0 && physical.vehicles?.length === 0 && (
                      <div className="empty-equity">
                        <Info size={24} color="#7788aa"/>
                        <div>No properties or vehicles declared. Add physical assets and link loans to see net equity.</div>
                      </div>
                    )}
                    
                    {physical.properties?.map((p: any) => {
                      const eq = getPropertyNetEquity(p.id, p.estimatedValue);
                      return (
                        <div key={p.id} className="equity-item">
                          <div className="eq-head">
                            <span className="eq-name">{p.name} ({p.city})</span>
                            <span className="eq-val">Value: ₹{p.estimatedValue.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="eq-meter-row">
                            <div className="eq-meter-track">
                              <div className="eq-meter-fill" style={{ width: `${Math.max(0, eq.pct)}%`, background: "#10b981" }}/>
                            </div>
                            <span className="eq-pct-text">{eq.pct.toFixed(0)}% Owner Equity</span>
                          </div>
                          <div className="eq-footer-details">
                            <span>Outstanding Loans: ₹{eq.debt.toLocaleString("en-IN")}</span>
                            <strong>Net Equity: ₹{eq.equity.toLocaleString("en-IN")}</strong>
                          </div>
                        </div>
                      );
                    })}

                    {/* vehicles */}
                    {physical.vehicles?.map((v: any) => {
                      const eq = getVehicleNetEquity(v.id, v.estimatedValue);
                      return (
                        <div key={v.id} className="equity-item">
                          <div className="eq-head">
                            <span className="eq-name">{v.name}</span>
                            <span className="eq-val">Value: ₹{v.estimatedValue.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="eq-meter-row">
                            <div className="eq-meter-track">
                              <div className="eq-meter-fill" style={{ width: `${Math.max(0, eq.pct)}%`, background: "#3b82f6" }}/>
                            </div>
                            <span className="eq-pct-text">{eq.pct.toFixed(0)}% Owner Equity</span>
                          </div>
                          <div className="eq-footer-details">
                            <span>Outstanding Loan: ₹{eq.debt.toLocaleString("en-IN")}</span>
                            <strong>Net Equity: ₹{eq.equity.toLocaleString("en-IN")}</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Contingent Liability & Protection Summary */}
            <div className="overview-risk-section card" style={{ marginTop: 24 }}>
              <div className="card-stripe" style={{ background: "#ef4444" }}/>
              <div className="card-body">
                <div className="card-head-title" style={{ marginBottom: 12 }}>Contingent Liabilities &amp; Risk Obligations</div>
                <p className="card-sub-info" style={{ marginBottom: 20 }}>Contingent liabilities represent financial exposures that are not hard debt but pose a significant potential risk.</p>
                
                <div className="risk-summary-grid">
                  <div className="risk-metric-box">
                    <span className="rm-lbl">Total Contingent Exposure</span>
                    <span className="rm-val">₹{contingentTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="risk-metric-box">
                    <span className="rm-lbl">Pending Tax Dues</span>
                    <span className="rm-val" style={{ color: pendingTaxDues > 0 ? "#ef4444" : "#111" }}>
                      ₹{pendingTaxDues.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="risk-metric-box">
                    <span className="rm-lbl">Legal Disputes Exposure</span>
                    <span className="rm-val">₹{legalDisputesTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
           TAB: ASSETS LEDGER
           =================================================================== */}
        {activeTab === "assets" && (
          <div className="ledger-tab-content">
            
            {/* LIQUID ASSETS SECTION */}
            <div className="ledger-section card">
              <div className="card-body">
                <div className="card-head">
                  <div className="card-head-title">Liquid Assets (Total: ₹{totalLiquidAssets.toLocaleString("en-IN")})</div>
                  <button className="add-entry-btn" onClick={() => {
                    const accounts = [...(portfolio.assets.liquid.savingsAccounts || [])];
                    accounts.push({ id: Math.random().toString(), bankName: "New Bank", accountType: "savings", balance: 0, lastUpdated: new Date() });
                    setNestedField(["assets", "liquid", "savingsAccounts"], accounts);
                  }}><Plus size={12}/> Add Account</button>
                </div>

                {/* Savings accounts */}
                <div className="form-group-list">
                  <div className="sec-title-inline">Savings &amp; Salary Accounts</div>
                  {liquid.savingsAccounts?.map((acc: any, index: number) => (
                    <div key={acc.id} className="inline-form-row">
                      <div className="form-col" style={{ flex: 1.5 }}>
                        <label>Bank Name</label>
                        <input type="text" value={acc.bankName} onChange={e => {
                          const accounts = [...portfolio.assets.liquid.savingsAccounts];
                          accounts[index].bankName = e.target.value;
                          setNestedField(["assets", "liquid", "savingsAccounts"], accounts);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Account Type</label>
                        <select value={acc.accountType} onChange={e => {
                          const accounts = [...portfolio.assets.liquid.savingsAccounts];
                          accounts[index].accountType = e.target.value;
                          setNestedField(["assets", "liquid", "savingsAccounts"], accounts);
                        }}>
                          <option value="savings">Savings</option>
                          <option value="current">Current</option>
                          <option value="salary">Salary</option>
                        </select>
                      </div>
                      <div className="form-col">
                        <label>Current Balance (₹)</label>
                        <input type="number" value={acc.balance} onChange={e => {
                          const accounts = [...portfolio.assets.liquid.savingsAccounts];
                          accounts[index].balance = Number(e.target.value);
                          setNestedField(["assets", "liquid", "savingsAccounts"], accounts);
                        }}/>
                      </div>
                      <button className="delete-row-btn" onClick={() => {
                        const accounts = portfolio.assets.liquid.savingsAccounts.filter((a: any) => a.id !== acc.id);
                        setNestedField(["assets", "liquid", "savingsAccounts"], accounts);
                      }}><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>

                {/* Fixed Deposits */}
                <div className="form-group-list" style={{ marginTop: 24 }}>
                  <div className="card-head" style={{ marginBottom: 12 }}>
                    <div className="sec-title-inline">Fixed Deposits (FD)</div>
                    <button className="add-entry-btn" onClick={() => {
                      const fds = [...(portfolio.assets.liquid.fixedDeposits || [])];
                      fds.push({ id: Math.random().toString(), bankName: "New Bank", principal: 0, interestRate: 7, isCumulative: true });
                      setNestedField(["assets", "liquid", "fixedDeposits"], fds);
                    }}><Plus size={12}/> Add FD</button>
                  </div>
                  
                  {liquid.fixedDeposits?.map((fd: any, index: number) => (
                    <div key={fd.id} className="inline-form-row">
                      <div className="form-col" style={{ flex: 1.2 }}>
                        <label>Bank Name</label>
                        <input type="text" value={fd.bankName} onChange={e => {
                          const fds = [...portfolio.assets.liquid.fixedDeposits];
                          fds[index].bankName = e.target.value;
                          setNestedField(["assets", "liquid", "fixedDeposits"], fds);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Principal (₹)</label>
                        <input type="number" value={fd.principal} onChange={e => {
                          const fds = [...portfolio.assets.liquid.fixedDeposits];
                          fds[index].principal = Number(e.target.value);
                          setNestedField(["assets", "liquid", "fixedDeposits"], fds);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Rate (%)</label>
                        <input type="number" value={fd.interestRate} step={0.1} onChange={e => {
                          const fds = [...portfolio.assets.liquid.fixedDeposits];
                          fds[index].interestRate = Number(e.target.value);
                          setNestedField(["assets", "liquid", "fixedDeposits"], fds);
                        }}/>
                      </div>
                      <div className="form-col" style={{ flex: 0.8 }}>
                        <label>Cumulative?</label>
                        <select value={fd.isCumulative ? "yes" : "no"} onChange={e => {
                          const fds = [...portfolio.assets.liquid.fixedDeposits];
                          fds[index].isCumulative = e.target.value === "yes";
                          setNestedField(["assets", "liquid", "fixedDeposits"], fds);
                        }}>
                          <option value="yes">Cumulative</option>
                          <option value="no">Monthly Payout</option>
                        </select>
                      </div>
                      <button className="delete-row-btn" onClick={() => {
                        const fds = portfolio.assets.liquid.fixedDeposits.filter((f: any) => f.id !== fd.id);
                        setNestedField(["assets", "liquid", "fixedDeposits"], fds);
                      }}><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>

                {/* Recurring Deposits */}
                <div className="form-group-list" style={{ marginTop: 24 }}>
                  <div className="card-head" style={{ marginBottom: 12 }}>
                    <div className="sec-title-inline">Recurring Deposits (RD)</div>
                    <button className="add-entry-btn" onClick={() => {
                      const rds = [...(portfolio.assets.liquid.recurringDeposits || [])];
                      rds.push({ id: Math.random().toString(), bankName: "New Bank", monthlyInstallment: 0, interestRate: 7, investedSoFar: 0 });
                      setNestedField(["assets", "liquid", "recurringDeposits"], rds);
                    }}><Plus size={12}/> Add RD</button>
                  </div>
                  
                  {liquid.recurringDeposits?.map((rd: any, index: number) => (
                    <div key={rd.id} className="inline-form-row">
                      <div className="form-col" style={{ flex: 1.2 }}>
                        <label>Bank Name</label>
                        <input type="text" value={rd.bankName} onChange={e => {
                          const rds = [...portfolio.assets.liquid.recurringDeposits];
                          rds[index].bankName = e.target.value;
                          setNestedField(["assets", "liquid", "recurringDeposits"], rds);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Monthly Installment (₹)</label>
                        <input type="number" value={rd.monthlyInstallment} onChange={e => {
                          const rds = [...portfolio.assets.liquid.recurringDeposits];
                          rds[index].monthlyInstallment = Number(e.target.value);
                          setNestedField(["assets", "liquid", "recurringDeposits"], rds);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Total Invested (₹)</label>
                        <input type="number" value={rd.investedSoFar} onChange={e => {
                          const rds = [...portfolio.assets.liquid.recurringDeposits];
                          rds[index].investedSoFar = Number(e.target.value);
                          setNestedField(["assets", "liquid", "recurringDeposits"], rds);
                        }}/>
                      </div>
                      <div className="form-col" style={{ flex: 0.6 }}>
                        <label>RD Rate (%)</label>
                        <input type="number" value={rd.interestRate} step={0.1} onChange={e => {
                          const rds = [...portfolio.assets.liquid.recurringDeposits];
                          rds[index].interestRate = Number(e.target.value);
                          setNestedField(["assets", "liquid", "recurringDeposits"], rds);
                        }}/>
                      </div>
                      <button className="delete-row-btn" onClick={() => {
                        const rds = portfolio.assets.liquid.recurringDeposits.filter((r: any) => r.id !== rd.id);
                        setNestedField(["assets", "liquid", "recurringDeposits"], rds);
                      }}><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>

                {/* Cash & Digital Wallets */}
                <div className="sec-title-inline" style={{ marginTop: 24, marginBottom: 12 }}>Digital Wallets &amp; Cash in Hand</div>
                <div className="inline-form-row">
                  <div className="form-col" style={{ flex: 1 }}>
                    <label>Cash in Hand (₹)</label>
                    <input type="number" value={liquid.cashInHand} onChange={e => setNestedField(["assets", "liquid", "cashInHand"], Number(e.target.value))}/>
                  </div>
                  <div className="form-col" style={{ flex: 1 }}>
                    <label>Digital Wallets (Paytm / PhonePe / GPay) (₹)</label>
                    <input type="number" value={liquid.digitalWallets} onChange={e => setNestedField(["assets", "liquid", "digitalWallets"], Number(e.target.value))}/>
                  </div>
                </div>

              </div>
            </div>

            {/* INVESTMENTS SECTION */}
            <div className="ledger-section card" style={{ marginTop: 24 }}>
              <div className="card-body">
                <div className="card-head-title" style={{ marginBottom: 20 }}>Financial Investments (Total: ₹{totalInvestments.toLocaleString("en-IN")})</div>

                {/* Direct Equity Stocks */}
                <div className="sec-title-inline" style={{ marginBottom: 12 }}>Stocks / Direct Equity</div>
                <div className="inline-form-row">
                  <div className="form-col" style={{ flex: 1.5 }}>
                    <label>Broker Name (e.g. Zerodha, Groww)</label>
                    <input type="text" value={investments.stocks?.brokerName} onChange={e => setNestedField(["assets", "investments", "stocks", "brokerName"], e.target.value)}/>
                  </div>
                  <div className="form-col">
                    <label>Invested Amount (₹)</label>
                    <input type="number" value={investments.stocks?.investedAmount} onChange={e => setNestedField(["assets", "investments", "stocks", "investedAmount"], Number(e.target.value))}/>
                  </div>
                  <div className="form-col">
                    <label>Current Value (₹)</label>
                    <input type="number" value={investments.stocks?.currentValue} onChange={e => setNestedField(["assets", "investments", "stocks", "currentValue"], Number(e.target.value))}/>
                  </div>
                  <div className="form-col" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 6 }}>
                    <span className="pnl-summary-inline" style={{ color: stocksPnL >= 0 ? "#10b981" : "#ef4444" }}>
                      P&amp;L: ₹{stocksPnL.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Mutual Funds */}
                <div className="form-group-list" style={{ marginTop: 24 }}>
                  <div className="card-head" style={{ marginBottom: 12 }}>
                    <div className="sec-title-inline">Mutual Funds</div>
                    <button className="add-entry-btn" onClick={() => {
                      const mfs = [...(portfolio.assets.investments.mutualFunds || [])];
                      mfs.push({ id: Math.random().toString(), fundName: "New Mutual Fund", type: "equity", currentValue: 0, investedAmount: 0 });
                      setNestedField(["assets", "investments", "mutualFunds"], mfs);
                    }}><Plus size={12}/> Add Fund</button>
                  </div>
                  
                  {investments.mutualFunds?.map((mf: any, index: number) => (
                    <div key={mf.id} className="inline-form-row">
                      <div className="form-col" style={{ flex: 1.5 }}>
                        <label>Fund Name</label>
                        <input type="text" value={mf.fundName} onChange={e => {
                          const mfs = [...portfolio.assets.investments.mutualFunds];
                          mfs[index].fundName = e.target.value;
                          setNestedField(["assets", "investments", "mutualFunds"], mfs);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Type</label>
                        <select value={mf.type} onChange={e => {
                          const mfs = [...portfolio.assets.investments.mutualFunds];
                          mfs[index].type = e.target.value;
                          setNestedField(["assets", "investments", "mutualFunds"], mfs);
                        }}>
                          <option value="equity">Equity</option>
                          <option value="debt">Debt</option>
                          <option value="hybrid">Hybrid</option>
                          <option value="ELSS">ELSS</option>
                        </select>
                      </div>
                      <div className="form-col">
                        <label>Invested Amount (₹)</label>
                        <input type="number" value={mf.investedAmount} onChange={e => {
                          const mfs = [...portfolio.assets.investments.mutualFunds];
                          mfs[index].investedAmount = Number(e.target.value);
                          setNestedField(["assets", "investments", "mutualFunds"], mfs);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Current Value (₹)</label>
                        <input type="number" value={mf.currentValue} onChange={e => {
                          const mfs = [...portfolio.assets.investments.mutualFunds];
                          mfs[index].currentValue = Number(e.target.value);
                          setNestedField(["assets", "investments", "mutualFunds"], mfs);
                        }}/>
                      </div>
                      <button className="delete-row-btn" onClick={() => {
                        const mfs = portfolio.assets.investments.mutualFunds.filter((m: any) => m.id !== mf.id);
                        setNestedField(["assets", "investments", "mutualFunds"], mfs);
                      }}><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>

                {/* Retirement Plans (PPF, EPF, NPS) */}
                <div className="sec-title-inline" style={{ marginTop: 24, marginBottom: 12 }}>Retirement &amp; Provident Funds</div>
                <div className="nested-grid-row">
                  {/* PPF */}
                  <div className="form-sub-card">
                    <div className="sub-card-title">PPF (Public Provident Fund)</div>
                    <div className="form-col">
                      <label>Current PPF Balance (₹)</label>
                      <input type="number" value={investments.ppf?.corpus} onChange={e => setNestedField(["assets", "investments", "ppf", "corpus"], Number(e.target.value))}/>
                    </div>
                    <div className="form-col" style={{ marginTop: 10 }}>
                      <label>Annual Contribution (₹)</label>
                      <input type="number" value={investments.ppf?.annualContribution} onChange={e => setNestedField(["assets", "investments", "ppf", "annualContribution"], Number(e.target.value))}/>
                    </div>
                  </div>

                  {/* EPF */}
                  <div className="form-sub-card">
                    <div className="sub-card-title">EPF (Employee Provident Fund)</div>
                    <div className="form-col">
                      <label>Current EPF Balance (₹)</label>
                      <input type="number" value={investments.epf?.corpus} onChange={e => setNestedField(["assets", "investments", "epf", "corpus"], Number(e.target.value))}/>
                    </div>
                    <div className="form-col" style={{ marginTop: 10 }}>
                      <label>Monthly Contribution (₹)</label>
                      <input type="number" value={investments.epf?.employeeMonthlyContribution} onChange={e => setNestedField(["assets", "investments", "epf", "employeeMonthlyContribution"], Number(e.target.value))}/>
                    </div>
                  </div>

                  {/* NPS */}
                  <div className="form-sub-card">
                    <div className="sub-card-title">NPS (National Pension System)</div>
                    <div className="form-col">
                      <label>Current NPS Corpus (₹)</label>
                      <input type="number" value={investments.nps?.corpus} onChange={e => setNestedField(["assets", "investments", "nps", "corpus"], Number(e.target.value))}/>
                    </div>
                    <div className="form-col" style={{ marginTop: 10 }}>
                      <label>NPS Tier</label>
                      <select value={investments.nps?.tier} onChange={e => setNestedField(["assets", "investments", "nps", "tier"], e.target.value)}>
                        <option value="tier1">Tier 1 (Tax Saved)</option>
                        <option value="tier2">Tier 2 (Withdrawal Allowed)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SGB & US Stocks */}
                <div className="sec-title-inline" style={{ marginTop: 24, marginBottom: 12 }}>SGB &amp; International Equities</div>
                <div className="nested-grid-row">
                  {/* SGB */}
                  <div className="form-sub-card" style={{ flex: 1.5 }}>
                    <div className="card-head" style={{ marginBottom: 10 }}>
                      <div className="sub-card-title">Sovereign Gold Bonds (SGB)</div>
                      <button className="add-entry-btn" onClick={() => {
                        const bonds = [...(portfolio.assets.investments.sgbBonds || [])];
                        bonds.push({ id: Math.random().toString(), name: "SGB 2026 Series", faceValue: 0, currentValue: 0 });
                        setNestedField(["assets", "investments", "sgbBonds"], bonds);
                      }}><Plus size={10}/> Add Bond</button>
                    </div>
                    
                    {investments.sgbBonds?.map((b: any, index: number) => (
                      <div key={b.id} className="inline-form-row" style={{ padding: 4, background: "none", border: "none" }}>
                        <input type="text" placeholder="SGB Series Name" value={b.name} style={{ flex: 1.2 }} onChange={e => {
                          const bonds = [...portfolio.assets.investments.sgbBonds];
                          bonds[index].name = e.target.value;
                          setNestedField(["assets", "investments", "sgbBonds"], bonds);
                        }}/>
                        <input type="number" placeholder="Current Value (₹)" value={b.currentValue} style={{ flex: 1 }} onChange={e => {
                          const bonds = [...portfolio.assets.investments.sgbBonds];
                          bonds[index].currentValue = Number(e.target.value);
                          setNestedField(["assets", "investments", "sgbBonds"], bonds);
                        }}/>
                        <button className="delete-row-btn" onClick={() => {
                          const bonds = portfolio.assets.investments.sgbBonds.filter((sgb: any) => sgb.id !== b.id);
                          setNestedField(["assets", "investments", "sgbBonds"], bonds);
                        }}><Trash2 size={12}/></button>
                      </div>
                    ))}
                  </div>

                  {/* US Stocks */}
                  <div className="form-sub-card" style={{ flex: 1 }}>
                    <div className="sub-card-title">US Stocks / ETFs</div>
                    <div className="form-col">
                      <label>Platform (INDmoney, Vested)</label>
                      <input type="text" value={investments.usStocks?.platform} onChange={e => setNestedField(["assets", "investments", "usStocks", "platform"], e.target.value)}/>
                    </div>
                    <div className="form-col" style={{ marginTop: 10 }}>
                      <label>Current Value (USD $)</label>
                      <input type="number" value={investments.usStocks?.currentValueUSD} onChange={e => setNestedField(["assets", "investments", "usStocks", "currentValueUSD"], Number(e.target.value))}/>
                    </div>
                    <div className="form-col" style={{ marginTop: 10 }}>
                      <label>Exchange Rate (₹/$)</label>
                      <input type="number" step={0.05} value={investments.usStocks?.exchangeRate} onChange={e => setNestedField(["assets", "investments", "usStocks", "exchangeRate"], Number(e.target.value))}/>
                    </div>
                    <div className="usd-inr-conversion" style={{ marginTop: 12, fontSize: "0.75rem", fontWeight: 700, color: "#0055EE" }}>
                      INR Value: ₹{Math.round(usStocksTotal).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* PHYSICAL ASSETS SECTION */}
            <div className="ledger-section card" style={{ marginTop: 24 }}>
              <div className="card-body">
                <div className="card-head-title" style={{ marginBottom: 20 }}>Physical Assets (Total: ₹{totalPhysicalAssets.toLocaleString("en-IN")})</div>

                {/* Properties */}
                <div className="form-group-list">
                  <div className="card-head" style={{ marginBottom: 12 }}>
                    <div className="sec-title-inline">Real Estate Properties</div>
                    <button className="add-entry-btn" onClick={() => {
                      const props = [...(portfolio.assets.physical.properties || [])];
                      props.push({ id: Math.random().toString(), name: "Primary House", type: "house", city: "Bangalore", estimatedValue: 0, isSelfOccupied: true });
                      setNestedField(["assets", "physical", "properties"], props);
                    }}><Plus size={12}/> Add Property</button>
                  </div>
                  
                  {physical.properties?.map((p: any, index: number) => (
                    <div key={p.id} className="inline-form-row">
                      <div className="form-col" style={{ flex: 1.2 }}>
                        <label>Property Tag Name</label>
                        <input type="text" value={p.name} onChange={e => {
                          const props = [...portfolio.assets.physical.properties];
                          props[index].name = e.target.value;
                          setNestedField(["assets", "physical", "properties"], props);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Property Type</label>
                        <select value={p.type} onChange={e => {
                          const props = [...portfolio.assets.physical.properties];
                          props[index].type = e.target.value;
                          setNestedField(["assets", "physical", "properties"], props);
                        }}>
                          <option value="flat">Apartment / Flat</option>
                          <option value="house">Independent House</option>
                          <option value="plot">Plot of Land</option>
                        </select>
                      </div>
                      <div className="form-col">
                        <label>Estimated Value (₹)</label>
                        <input type="number" value={p.estimatedValue} onChange={e => {
                          const props = [...portfolio.assets.physical.properties];
                          props[index].estimatedValue = Number(e.target.value);
                          setNestedField(["assets", "physical", "properties"], props);
                        }}/>
                      </div>
                      <div className="form-col" style={{ flex: 0.8 }}>
                        <label>Occupied?</label>
                        <select value={p.isSelfOccupied ? "self" : "rented"} onChange={e => {
                          const props = [...portfolio.assets.physical.properties];
                          props[index].isSelfOccupied = e.target.value === "self";
                          setNestedField(["assets", "physical", "properties"], props);
                        }}>
                          <option value="self">Self-Occupied</option>
                          <option value="rented">Rented Out</option>
                        </select>
                      </div>
                      {!p.isSelfOccupied && (
                        <div className="form-col">
                          <label>Monthly Rent (₹)</label>
                          <input type="number" value={p.rentalIncome || 0} onChange={e => {
                            const props = [...portfolio.assets.physical.properties];
                            props[index].rentalIncome = Number(e.target.value);
                            setNestedField(["assets", "physical", "properties"], props);
                          }}/>
                        </div>
                      )}
                      <button className="delete-row-btn" onClick={() => {
                        const props = portfolio.assets.physical.properties.filter((prop: any) => prop.id !== p.id);
                        setNestedField(["assets", "physical", "properties"], props);
                      }}><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>

                {/* Vehicles */}
                <div className="form-group-list" style={{ marginTop: 24 }}>
                  <div className="card-head" style={{ marginBottom: 12 }}>
                    <div className="sec-title-inline">Vehicles</div>
                    <button className="add-entry-btn" onClick={() => {
                      const vehs = [...(portfolio.assets.physical.vehicles || [])];
                      vehs.push({ id: Math.random().toString(), name: "My Car", type: "car", estimatedValue: 0 });
                      setNestedField(["assets", "physical", "vehicles"], vehs);
                    }}><Plus size={12}/> Add Vehicle</button>
                  </div>
                  
                  {physical.vehicles?.map((v: any, index: number) => (
                    <div key={v.id} className="inline-form-row">
                      <div className="form-col" style={{ flex: 1.5 }}>
                        <label>Vehicle Make &amp; Model</label>
                        <input type="text" value={v.name} onChange={e => {
                          const vehs = [...portfolio.assets.physical.vehicles];
                          vehs[index].name = e.target.value;
                          setNestedField(["assets", "physical", "vehicles"], vehs);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Vehicle Type</label>
                        <select value={v.type} onChange={e => {
                          const vehs = [...portfolio.assets.physical.vehicles];
                          vehs[index].type = e.target.value;
                          setNestedField(["assets", "physical", "vehicles"], vehs);
                        }}>
                          <option value="car">Car / Sedan / SUV</option>
                          <option value="bike">Bike / Two-Wheeler</option>
                          <option value="commercial">Commercial Vehicle</option>
                        </select>
                      </div>
                      <div className="form-col">
                        <label>Estimated Value (₹)</label>
                        <input type="number" value={v.estimatedValue} onChange={e => {
                          const vehs = [...portfolio.assets.physical.vehicles];
                          vehs[index].estimatedValue = Number(e.target.value);
                          setNestedField(["assets", "physical", "vehicles"], vehs);
                        }}/>
                      </div>
                      <button className="delete-row-btn" onClick={() => {
                        const vehs = portfolio.assets.physical.vehicles.filter((veh: any) => veh.id !== v.id);
                        setNestedField(["assets", "physical", "vehicles"], vehs);
                      }}><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>

                {/* Gold, Silver & Collectibles */}
                <div className="sec-title-inline" style={{ marginTop: 24, marginBottom: 12 }}>Precious Metals &amp; Collectibles</div>
                <div className="nested-grid-row">
                  {/* Gold & Jewellery */}
                  <div className="form-sub-card">
                    <div className="sub-card-title">Gold &amp; Jewellery</div>
                    <div className="form-col">
                      <label>Weight (grams)</label>
                      <input type="number" value={physical.goldJewellery?.weightGrams} onChange={e => setNestedField(["assets", "physical", "goldJewellery", "weightGrams"], Number(e.target.value))}/>
                    </div>
                    <div className="form-col" style={{ marginTop: 10 }}>
                      <label>Purity Factor</label>
                      <select value={physical.goldJewellery?.purity} onChange={e => setNestedField(["assets", "physical", "goldJewellery", "purity"], e.target.value)}>
                        <option value="24K">24K (Pure Gold)</option>
                        <option value="22K">22K (Standard Jewellery)</option>
                        <option value="18K">18K (Solid Jewellery)</option>
                      </select>
                    </div>
                    <div className="gold-silver-rate-hint" style={{ marginTop: 12, padding: "8px 10px", background: "#fcfdfe", borderRadius: 8, fontSize: "0.74rem" }}>
                      <div>Stable Gold Rate: ₹{goldRate}/g</div>
                      <strong style={{ color: "#10b981", display: "block", marginTop: 4 }}>
                        Value: ₹{Math.round(goldCalculated).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  {/* Silver */}
                  <div className="form-sub-card">
                    <div className="sub-card-title">Silver &amp; Precious Metals</div>
                    <div className="form-col">
                      <label>Weight (grams)</label>
                      <input type="number" value={physical.silverMetals?.weightGrams} onChange={e => setNestedField(["assets", "physical", "silverMetals", "weightGrams"], Number(e.target.value))}/>
                    </div>
                    <div className="gold-silver-rate-hint" style={{ marginTop: 32, padding: "8px 10px", background: "#fcfdfe", borderRadius: 8, fontSize: "0.74rem" }}>
                      <div>Silver Rate: ₹{SILVER_RATE}/g</div>
                      <strong style={{ color: "#10b981", display: "block", marginTop: 4 }}>
                        Value: ₹{Math.round(silverCalculated).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>

                  {/* Collectibles */}
                  <div className="form-sub-card" style={{ flex: 1.2 }}>
                    <div className="card-head" style={{ marginBottom: 10 }}>
                      <div className="sub-card-title">Art &amp; Collectibles</div>
                      <button className="add-entry-btn" onClick={() => {
                        const cols = [...(portfolio.assets.physical.collectibles || [])];
                        cols.push({ id: Math.random().toString(), description: "Vintage Watch", estimatedValue: 0 });
                        setNestedField(["assets", "physical", "collectibles"], cols);
                      }}><Plus size={10}/> Add</button>
                    </div>
                    {physical.collectibles?.map((col: any, index: number) => (
                      <div key={col.id} className="inline-form-row" style={{ padding: 4, background: "none", border: "none" }}>
                        <input type="text" placeholder="Description" value={col.description} style={{ flex: 1.5 }} onChange={e => {
                          const cols = [...portfolio.assets.physical.collectibles];
                          cols[index].description = e.target.value;
                          setNestedField(["assets", "physical", "collectibles"], cols);
                        }}/>
                        <input type="number" placeholder="Value (₹)" value={col.estimatedValue} style={{ flex: 1 }} onChange={e => {
                          const cols = [...portfolio.assets.physical.collectibles];
                          cols[index].estimatedValue = Number(e.target.value);
                          setNestedField(["assets", "physical", "collectibles"], cols);
                        }}/>
                        <button className="delete-row-btn" onClick={() => {
                          const cols = portfolio.assets.physical.collectibles.filter((c: any) => c.id !== col.id);
                          setNestedField(["assets", "physical", "collectibles"], cols);
                        }}><Trash2 size={12}/></button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* OTHER ASSETS SECTION */}
            <div className="ledger-section card" style={{ marginTop: 24 }}>
              <div className="card-body">
                <div className="card-head-title" style={{ marginBottom: 20 }}>Other Receivable Assets (Total: ₹{totalOtherAssets.toLocaleString("en-IN")})</div>

                {/* Business Equity */}
                <div className="form-group-list">
                  <div className="card-head" style={{ marginBottom: 12 }}>
                    <div className="sec-title-inline">Business Ownership / Equity</div>
                    <button className="add-entry-btn" onClick={() => {
                      const cos = [...(portfolio.assets.other.businessOwnership || [])];
                      cos.push({ id: Math.random().toString(), businessName: "My Startup", ownershipPct: 20, estimatedValue: 0 });
                      setNestedField(["assets", "other", "businessOwnership"], cos);
                    }}><Plus size={12}/> Add Business</button>
                  </div>
                  
                  {otherAssets.businessOwnership?.map((b: any, index: number) => (
                    <div key={b.id} className="inline-form-row">
                      <div className="form-col" style={{ flex: 1.5 }}>
                        <label>Business Name</label>
                        <input type="text" value={b.businessName} onChange={e => {
                          const cos = [...portfolio.assets.other.businessOwnership];
                          cos[index].businessName = e.target.value;
                          setNestedField(["assets", "other", "businessOwnership"], cos);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Ownership %</label>
                        <input type="number" value={b.ownershipPct} onChange={e => {
                          const cos = [...portfolio.assets.other.businessOwnership];
                          cos[index].ownershipPct = Number(e.target.value);
                          setNestedField(["assets", "other", "businessOwnership"], cos);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Estimated Value (₹)</label>
                        <input type="number" value={b.estimatedValue} onChange={e => {
                          const cos = [...portfolio.assets.other.businessOwnership];
                          cos[index].estimatedValue = Number(e.target.value);
                          setNestedField(["assets", "other", "businessOwnership"], cos);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Valuation Basis</label>
                        <input type="text" placeholder="e.g. Revenue Multiple" value={b.valuationBasis || ""} onChange={e => {
                          const cos = [...portfolio.assets.other.businessOwnership];
                          cos[index].valuationBasis = e.target.value;
                          setNestedField(["assets", "other", "businessOwnership"], cos);
                        }}/>
                      </div>
                      <button className="delete-row-btn" onClick={() => {
                        const cos = portfolio.assets.other.businessOwnership.filter((c: any) => c.id !== b.id);
                        setNestedField(["assets", "other", "businessOwnership"], cos);
                      }}><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>

                {/* Loans Given to others */}
                <div className="form-group-list" style={{ marginTop: 24 }}>
                  <div className="card-head" style={{ marginBottom: 12 }}>
                    <div className="sec-title-inline">Loans Given to Others</div>
                    <button className="add-entry-btn" onClick={() => {
                      const loans = [...(portfolio.assets.other.loansGiven || [])];
                      loans.push({ id: Math.random().toString(), borrowerName: "Friend", amountLent: 0 });
                      setNestedField(["assets", "other", "loansGiven"], loans);
                    }}><Plus size={12}/> Add Loan Given</button>
                  </div>
                  
                  {otherAssets.loansGiven?.map((loan: any, index: number) => (
                    <div key={loan.id} className="inline-form-row">
                      <div className="form-col" style={{ flex: 1.5 }}>
                        <label>Borrower Name</label>
                        <input type="text" value={loan.borrowerName || ""} onChange={e => {
                          const loans = [...portfolio.assets.other.loansGiven];
                          loans[index].borrowerName = e.target.value;
                          setNestedField(["assets", "other", "loansGiven"], loans);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Amount Lent (₹)</label>
                        <input type="number" value={loan.amountLent} onChange={e => {
                          const loans = [...portfolio.assets.other.loansGiven];
                          loans[index].amountLent = Number(e.target.value);
                          setNestedField(["assets", "other", "loansGiven"], loans);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Interest Rate (% optional)</label>
                        <input type="number" value={loan.interestRate || ""} onChange={e => {
                          const loans = [...portfolio.assets.other.loansGiven];
                          loans[index].interestRate = Number(e.target.value);
                          setNestedField(["assets", "other", "loansGiven"], loans);
                        }}/>
                      </div>
                      <button className="delete-row-btn" onClick={() => {
                        const loans = portfolio.assets.other.loansGiven.filter((l: any) => l.id !== loan.id);
                        setNestedField(["assets", "other", "loansGiven"], loans);
                      }}><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>

                {/* Legacy Gratuity */}
                <div className="sec-title-inline" style={{ marginTop: 24, marginBottom: 12 }}>Gratuity &amp; Legacy Benefits</div>
                <div className="form-col" style={{ maxWidth: 320 }}>
                  <label>EPF / Gratuity from previous employers yet to receive (₹)</label>
                  <input type="number" value={otherAssets.previousGratuity} onChange={e => setNestedField(["assets", "other", "previousGratuity"], Number(e.target.value))}/>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ===================================================================
           TAB: LIABILITIES LEDGER
           =================================================================== */}
        {activeTab === "liabilities" && (
          <div className="ledger-tab-content">
            
            {/* SHORT-TERM LIABILITIES */}
            <div className="ledger-section card">
              <div className="card-body">
                <div className="card-head-title" style={{ marginBottom: 20 }}>Short-Term Liabilities (Total: ₹{totalShortTermLiabilities.toLocaleString("en-IN")})</div>

                {/* Credit Cards */}
                <div className="form-group-list">
                  <div className="card-head" style={{ marginBottom: 12 }}>
                    <div className="sec-title-inline">Credit Card Outstanding</div>
                    <button className="add-entry-btn" onClick={() => {
                      const ccs = [...(portfolio.liabilities.shortTerm.creditCards || [])];
                      ccs.push({ id: Math.random().toString(), cardName: "HDFC Card", outstanding: 0, minimumDue: 0 });
                      setNestedField(["liabilities", "shortTerm", "creditCards"], ccs);
                    }}><Plus size={12}/> Add Card</button>
                  </div>
                  
                  {shortTerm.creditCards?.map((cc: any, index: number) => (
                    <div key={cc.id} className="inline-form-row">
                      <div className="form-col" style={{ flex: 1.5 }}>
                        <label>Credit Card Name / Issuer</label>
                        <input type="text" value={cc.cardName} onChange={e => {
                          const ccs = [...portfolio.liabilities.shortTerm.creditCards];
                          ccs[index].cardName = e.target.value;
                          setNestedField(["liabilities", "shortTerm", "creditCards"], ccs);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Outstanding (₹)</label>
                        <input type="number" value={cc.outstanding} onChange={e => {
                          const ccs = [...portfolio.liabilities.shortTerm.creditCards];
                          ccs[index].outstanding = Number(e.target.value);
                          setNestedField(["liabilities", "shortTerm", "creditCards"], ccs);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Minimum Due (₹)</label>
                        <input type="number" value={cc.minimumDue} onChange={e => {
                          const ccs = [...portfolio.liabilities.shortTerm.creditCards];
                          ccs[index].minimumDue = Number(e.target.value);
                          setNestedField(["liabilities", "shortTerm", "creditCards"], ccs);
                        }}/>
                      </div>
                      <div className="form-col" style={{ flex: 0.8 }}>
                        <label>Credit Limit (₹)</label>
                        <input type="number" value={cc.creditLimit || ""} onChange={e => {
                          const ccs = [...portfolio.liabilities.shortTerm.creditCards];
                          ccs[index].creditLimit = Number(e.target.value);
                          setNestedField(["liabilities", "shortTerm", "creditCards"], ccs);
                        }}/>
                      </div>
                      <button className="delete-row-btn" onClick={() => {
                        const ccs = portfolio.liabilities.shortTerm.creditCards.filter((card: any) => card.id !== cc.id);
                        setNestedField(["liabilities", "shortTerm", "creditCards"], ccs);
                      }}><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>

                {/* BNPL platform */}
                <div className="form-group-list" style={{ marginTop: 24 }}>
                  <div className="card-head" style={{ marginBottom: 12 }}>
                    <div className="sec-title-inline">BNPL (Buy Now Pay Later e.g. Simpl, LazyPay)</div>
                    <button className="add-entry-btn" onClick={() => {
                      const bnpls = [...(portfolio.liabilities.shortTerm.bnpl || [])];
                      bnpls.push({ id: Math.random().toString(), platform: "Simpl", outstanding: 0 });
                      setNestedField(["liabilities", "shortTerm", "bnpl"], bnpls);
                    }}><Plus size={12}/> Add BNPL</button>
                  </div>
                  
                  {shortTerm.bnpl?.map((bp: any, index: number) => (
                    <div key={bp.id} className="inline-form-row">
                      <div className="form-col" style={{ flex: 1.5 }}>
                        <label>Platform Name</label>
                        <input type="text" value={bp.platform} onChange={e => {
                          const bnpls = [...portfolio.liabilities.shortTerm.bnpl];
                          bnpls[index].platform = e.target.value;
                          setNestedField(["liabilities", "shortTerm", "bnpl"], bnpls);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Outstanding (₹)</label>
                        <input type="number" value={bp.outstanding} onChange={e => {
                          const bnpls = [...portfolio.liabilities.shortTerm.bnpl];
                          bnpls[index].outstanding = Number(e.target.value);
                          setNestedField(["liabilities", "shortTerm", "bnpl"], bnpls);
                        }}/>
                      </div>
                      <button className="delete-row-btn" onClick={() => {
                        const bnpls = portfolio.liabilities.shortTerm.bnpl.filter((b: any) => b.id !== bp.id);
                        setNestedField(["liabilities", "shortTerm", "bnpl"], bnpls);
                      }}><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>

                {/* Personal Loans (Short-Term) */}
                <div className="form-group-list" style={{ marginTop: 24 }}>
                  <div className="card-head" style={{ marginBottom: 12 }}>
                    <div className="sec-title-inline">Personal Loans</div>
                    <button className="add-entry-btn" onClick={() => {
                      const loans = [...(portfolio.liabilities.shortTerm.personalLoans || [])];
                      loans.push({ id: Math.random().toString(), lender: "ICICI Bank", outstanding: 0, emi: 0, interestRate: 11, remainingTenureMonths: 12 });
                      setNestedField(["liabilities", "shortTerm", "personalLoans"], loans);
                    }}><Plus size={12}/> Add Loan</button>
                  </div>
                  
                  {shortTerm.personalLoans?.map((loan: any, index: number) => (
                    <div key={loan.id} className="inline-form-row">
                      <div className="form-col" style={{ flex: 1.2 }}>
                        <label>Lender</label>
                        <input type="text" value={loan.lender} onChange={e => {
                          const loans = [...portfolio.liabilities.shortTerm.personalLoans];
                          loans[index].lender = e.target.value;
                          setNestedField(["liabilities", "shortTerm", "personalLoans"], loans);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Outstanding Principal (₹)</label>
                        <input type="number" value={loan.outstanding} onChange={e => {
                          const loans = [...portfolio.liabilities.shortTerm.personalLoans];
                          loans[index].outstanding = Number(e.target.value);
                          setNestedField(["liabilities", "shortTerm", "personalLoans"], loans);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>EMI (₹/mo)</label>
                        <input type="number" value={loan.emi} onChange={e => {
                          const loans = [...portfolio.liabilities.shortTerm.personalLoans];
                          loans[index].emi = Number(e.target.value);
                          setNestedField(["liabilities", "shortTerm", "personalLoans"], loans);
                        }}/>
                      </div>
                      <div className="form-col" style={{ flex: 0.6 }}>
                        <label>Rate (%)</label>
                        <input type="number" value={loan.interestRate} step={0.1} onChange={e => {
                          const loans = [...portfolio.liabilities.shortTerm.personalLoans];
                          loans[index].interestRate = Number(e.target.value);
                          setNestedField(["liabilities", "shortTerm", "personalLoans"], loans);
                        }}/>
                      </div>
                      <div className="form-col" style={{ flex: 0.8 }}>
                        <label>Remaining Months</label>
                        <input type="number" value={loan.remainingTenureMonths} onChange={e => {
                          const loans = [...portfolio.liabilities.shortTerm.personalLoans];
                          loans[index].remainingTenureMonths = Number(e.target.value);
                          setNestedField(["liabilities", "shortTerm", "personalLoans"], loans);
                        }}/>
                      </div>
                      <button className="delete-row-btn" onClick={() => {
                        const loans = portfolio.liabilities.shortTerm.personalLoans.filter((l: any) => l.id !== loan.id);
                        setNestedField(["liabilities", "shortTerm", "personalLoans"], loans);
                      }}><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>

                {/* Informal Loans */}
                <div className="form-group-list" style={{ marginTop: 24 }}>
                  <div className="card-head" style={{ marginBottom: 12 }}>
                    <div className="sec-title-inline">Informal Loans (Owed to family / friends)</div>
                    <button className="add-entry-btn" onClick={() => {
                      const loans = [...(portfolio.liabilities.shortTerm.informalLoans || [])];
                      loans.push({ id: Math.random().toString(), lender: "Relative", outstanding: 0 });
                      setNestedField(["liabilities", "shortTerm", "informalLoans"], loans);
                    }}><Plus size={12}/> Add Informal Loan</button>
                  </div>
                  
                  {shortTerm.informalLoans?.map((loan: any, index: number) => (
                    <div key={loan.id} className="inline-form-row">
                      <div className="form-col" style={{ flex: 1.5 }}>
                        <label>Owed To (Lender)</label>
                        <input type="text" value={loan.lender || ""} onChange={e => {
                          const loans = [...portfolio.liabilities.shortTerm.informalLoans];
                          loans[index].lender = e.target.value;
                          setNestedField(["liabilities", "shortTerm", "informalLoans"], loans);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Amount Owed (₹)</label>
                        <input type="number" value={loan.outstanding} onChange={e => {
                          const loans = [...portfolio.liabilities.shortTerm.informalLoans];
                          loans[index].outstanding = Number(e.target.value);
                          setNestedField(["liabilities", "shortTerm", "informalLoans"], loans);
                        }}/>
                      </div>
                      <button className="delete-row-btn" onClick={() => {
                        const loans = portfolio.liabilities.shortTerm.informalLoans.filter((l: any) => l.id !== loan.id);
                        setNestedField(["liabilities", "shortTerm", "informalLoans"], loans);
                      }}><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* LONG-TERM LIABILITIES */}
            <div className="ledger-section card" style={{ marginTop: 24 }}>
              <div className="card-body">
                <div className="card-head-title" style={{ marginBottom: 20 }}>Long-Term Liabilities (Total: ₹{totalLongTermLiabilities.toLocaleString("en-IN")})</div>

                {/* Home Loans */}
                <div className="form-group-list">
                  <div className="card-head" style={{ marginBottom: 12 }}>
                    <div className="sec-title-inline">Home Loans &amp; Mortgages</div>
                    <button className="add-entry-btn" onClick={() => {
                      const loans = [...(portfolio.liabilities.longTerm.homeLoans || [])];
                      loans.push({ id: Math.random().toString(), lender: "SBI", outstanding: 0, emi: 0, interestRate: 8.5, loanType: "floating", remainingTenureMonths: 180 });
                      setNestedField(["liabilities", "longTerm", "homeLoans"], loans);
                    }}><Plus size={12}/> Add Home Loan</button>
                  </div>
                  
                  {longTerm.homeLoans?.map((loan: any, index: number) => (
                    <div key={loan.id} className="inline-form-row">
                      <div className="form-col" style={{ flex: 1.2 }}>
                        <label>Lender</label>
                        <input type="text" value={loan.lender} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.homeLoans];
                          loans[index].lender = e.target.value;
                          setNestedField(["liabilities", "longTerm", "homeLoans"], loans);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Outstanding Principal (₹)</label>
                        <input type="number" value={loan.outstanding} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.homeLoans];
                          loans[index].outstanding = Number(e.target.value);
                          setNestedField(["liabilities", "longTerm", "homeLoans"], loans);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>EMI (₹/mo)</label>
                        <input type="number" value={loan.emi} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.homeLoans];
                          loans[index].emi = Number(e.target.value);
                          setNestedField(["liabilities", "longTerm", "homeLoans"], loans);
                        }}/>
                      </div>
                      <div className="form-col" style={{ flex: 0.6 }}>
                        <label>Rate (%)</label>
                        <input type="number" value={loan.interestRate} step={0.1} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.homeLoans];
                          loans[index].interestRate = Number(e.target.value);
                          setNestedField(["liabilities", "longTerm", "homeLoans"], loans);
                        }}/>
                      </div>
                      <div className="form-col" style={{ flex: 0.8 }}>
                        <label>Loan Type</label>
                        <select value={loan.loanType} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.homeLoans];
                          loans[index].loanType = e.target.value;
                          setNestedField(["liabilities", "longTerm", "homeLoans"], loans);
                        }}>
                          <option value="floating">Floating</option>
                          <option value="fixed">Fixed</option>
                        </select>
                      </div>
                      <div className="form-col" style={{ flex: 1.4 }}>
                        <label>Link to Property Asset</label>
                        <select value={loan.linkedAssetId || ""} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.homeLoans];
                          loans[index].linkedAssetId = e.target.value;
                          setNestedField(["liabilities", "longTerm", "homeLoans"], loans);
                        }}>
                          <option value="">-- Unlinked --</option>
                          {physical.properties?.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <button className="delete-row-btn" onClick={() => {
                        const loans = portfolio.liabilities.longTerm.homeLoans.filter((l: any) => l.id !== loan.id);
                        setNestedField(["liabilities", "longTerm", "homeLoans"], loans);
                      }}><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>

                {/* Vehicle Loans */}
                <div className="form-group-list" style={{ marginTop: 24 }}>
                  <div className="card-head" style={{ marginBottom: 12 }}>
                    <div className="sec-title-inline">Car &amp; Vehicle Loans</div>
                    <button className="add-entry-btn" onClick={() => {
                      const loans = [...(portfolio.liabilities.longTerm.carLoans || [])];
                      loans.push({ id: Math.random().toString(), lender: "HDFC", outstanding: 0, emi: 0, interestRate: 9.5, remainingTenureMonths: 36 });
                      setNestedField(["liabilities", "longTerm", "carLoans"], loans);
                    }}><Plus size={12}/> Add Vehicle Loan</button>
                  </div>
                  
                  {longTerm.carLoans?.map((loan: any, index: number) => (
                    <div key={loan.id} className="inline-form-row">
                      <div className="form-col" style={{ flex: 1.2 }}>
                        <label>Lender</label>
                        <input type="text" value={loan.lender} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.carLoans];
                          loans[index].lender = e.target.value;
                          setNestedField(["liabilities", "longTerm", "carLoans"], loans);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Outstanding (₹)</label>
                        <input type="number" value={loan.outstanding} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.carLoans];
                          loans[index].outstanding = Number(e.target.value);
                          setNestedField(["liabilities", "longTerm", "carLoans"], loans);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>EMI (₹/mo)</label>
                        <input type="number" value={loan.emi} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.carLoans];
                          loans[index].emi = Number(e.target.value);
                          setNestedField(["liabilities", "longTerm", "carLoans"], loans);
                        }}/>
                      </div>
                      <div className="form-col" style={{ flex: 0.6 }}>
                        <label>Rate (%)</label>
                        <input type="number" value={loan.interestRate} step={0.1} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.carLoans];
                          loans[index].interestRate = Number(e.target.value);
                          setNestedField(["liabilities", "longTerm", "carLoans"], loans);
                        }}/>
                      </div>
                      <div className="form-col" style={{ flex: 1.4 }}>
                        <label>Link to Vehicle Asset</label>
                        <select value={loan.linkedAssetId || ""} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.carLoans];
                          loans[index].linkedAssetId = e.target.value;
                          setNestedField(["liabilities", "longTerm", "carLoans"], loans);
                        }}>
                          <option value="">-- Unlinked --</option>
                          {physical.vehicles?.map((v: any) => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                          ))}
                        </select>
                      </div>
                      <button className="delete-row-btn" onClick={() => {
                        const loans = portfolio.liabilities.longTerm.carLoans.filter((l: any) => l.id !== loan.id);
                        setNestedField(["liabilities", "longTerm", "carLoans"], loans);
                      }}><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>

                {/* LAP Loan Against Property */}
                <div className="form-group-list" style={{ marginTop: 24 }}>
                  <div className="card-head" style={{ marginBottom: 12 }}>
                    <div className="sec-title-inline">Loan Against Property (LAP)</div>
                    <button className="add-entry-btn" onClick={() => {
                      const loans = [...(portfolio.liabilities.longTerm.loansAgainstProperty || [])];
                      loans.push({ id: Math.random().toString(), lender: "Bajaj Finance", outstanding: 0, emi: 0, interestRate: 9.8, remainingTenureMonths: 60 });
                      setNestedField(["liabilities", "longTerm", "loansAgainstProperty"], loans);
                    }}><Plus size={12}/> Add LAP</button>
                  </div>
                  
                  {longTerm.loansAgainstProperty?.map((loan: any, index: number) => (
                    <div key={loan.id} className="inline-form-row">
                      <div className="form-col" style={{ flex: 1.2 }}>
                        <label>Lender</label>
                        <input type="text" value={loan.lender} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.loansAgainstProperty];
                          loans[index].lender = e.target.value;
                          setNestedField(["liabilities", "longTerm", "loansAgainstProperty"], loans);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Outstanding (₹)</label>
                        <input type="number" value={loan.outstanding} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.loansAgainstProperty];
                          loans[index].outstanding = Number(e.target.value);
                          setNestedField(["liabilities", "longTerm", "loansAgainstProperty"], loans);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>EMI (₹/mo)</label>
                        <input type="number" value={loan.emi} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.loansAgainstProperty];
                          loans[index].emi = Number(e.target.value);
                          setNestedField(["liabilities", "longTerm", "loansAgainstProperty"], loans);
                        }}/>
                      </div>
                      <div className="form-col" style={{ flex: 1.4 }}>
                        <label>Link to Property Asset</label>
                        <select value={loan.linkedAssetId || ""} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.loansAgainstProperty];
                          loans[index].linkedAssetId = e.target.value;
                          setNestedField(["liabilities", "longTerm", "loansAgainstProperty"], loans);
                        }}>
                          <option value="">-- Unlinked --</option>
                          {physical.properties?.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <button className="delete-row-btn" onClick={() => {
                        const loans = portfolio.liabilities.longTerm.loansAgainstProperty.filter((l: any) => l.id !== loan.id);
                        setNestedField(["liabilities", "longTerm", "loansAgainstProperty"], loans);
                      }}><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>

                {/* Education, Business & Gold Loans */}
                <div className="sec-title-inline" style={{ marginTop: 24, marginBottom: 12 }}>Education, Business &amp; Gold Loans</div>
                <div className="nested-grid-row">
                  {/* Education Loan */}
                  <div className="form-sub-card">
                    <div className="card-head" style={{ marginBottom: 10 }}>
                      <div className="sub-card-title">Education Loans</div>
                      <button className="add-entry-btn" onClick={() => {
                        const loans = [...(portfolio.liabilities.longTerm.educationLoans || [])];
                        loans.push({ id: Math.random().toString(), lender: "Bank of Baroda", outstanding: 0, emi: 0, interestRate: 9, remainingTenureMonths: 60, isMoratoriumActive: false });
                        setNestedField(["liabilities", "longTerm", "educationLoans"], loans);
                      }}><Plus size={10}/> Add</button>
                    </div>
                    {longTerm.educationLoans?.map((loan: any, index: number) => (
                      <div key={loan.id} className="form-sub-card-row" style={{ marginBottom: 14, borderBottom: "1px solid #f0f2f8", paddingBottom: 10 }}>
                        <input type="text" placeholder="Lender" value={loan.lender} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.educationLoans];
                          loans[index].lender = e.target.value;
                          setNestedField(["liabilities", "longTerm", "educationLoans"], loans);
                        }}/>
                        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                          <input type="number" placeholder="Outstanding (₹)" value={loan.outstanding || ""} style={{ flex: 1.2 }} onChange={e => {
                            const loans = [...portfolio.liabilities.longTerm.educationLoans];
                            loans[index].outstanding = Number(e.target.value);
                            setNestedField(["liabilities", "longTerm", "educationLoans"], loans);
                          }}/>
                          <input type="number" placeholder="EMI (₹)" value={loan.emi || ""} style={{ flex: 1 }} onChange={e => {
                            const loans = [...portfolio.liabilities.longTerm.educationLoans];
                            loans[index].emi = Number(e.target.value);
                            setNestedField(["liabilities", "longTerm", "educationLoans"], loans);
                          }}/>
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center" }}>
                          <select value={loan.isMoratoriumActive ? "yes" : "no"} style={{ flex: 1.5, fontSize: "0.74rem" }} onChange={e => {
                            const loans = [...portfolio.liabilities.longTerm.educationLoans];
                            loans[index].isMoratoriumActive = e.target.value === "yes";
                            setNestedField(["liabilities", "longTerm", "educationLoans"], loans);
                          }}>
                            <option value="no">EMI Servicing Active</option>
                            <option value="yes">Moratorium (Study Period)</option>
                          </select>
                          <button className="delete-row-btn" onClick={() => {
                            const loans = portfolio.liabilities.longTerm.educationLoans.filter((l: any) => l.id !== loan.id);
                            setNestedField(["liabilities", "longTerm", "educationLoans"], loans);
                          }}><Trash2 size={12}/></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gold Loan */}
                  <div className="form-sub-card">
                    <div className="card-head" style={{ marginBottom: 10 }}>
                      <div className="sub-card-title">Gold Loans</div>
                      <button className="add-entry-btn" onClick={() => {
                        const loans = [...(portfolio.liabilities.longTerm.goldLoans || [])];
                        loans.push({ id: Math.random().toString(), lender: "Muthoot Finance", outstanding: 0, goldPledgedGrams: 0, interestRate: 12 });
                        setNestedField(["liabilities", "longTerm", "goldLoans"], loans);
                      }}><Plus size={10}/> Add</button>
                    </div>
                    {longTerm.goldLoans?.map((loan: any, index: number) => (
                      <div key={loan.id} className="form-sub-card-row" style={{ marginBottom: 14, borderBottom: "1px solid #f0f2f8", paddingBottom: 10 }}>
                        <input type="text" placeholder="Lender" value={loan.lender} onChange={e => {
                          const loans = [...portfolio.liabilities.longTerm.goldLoans];
                          loans[index].lender = e.target.value;
                          setNestedField(["liabilities", "longTerm", "goldLoans"], loans);
                        }}/>
                        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                          <input type="number" placeholder="Outstanding (₹)" value={loan.outstanding || ""} style={{ flex: 1.2 }} onChange={e => {
                            const loans = [...portfolio.liabilities.longTerm.goldLoans];
                            loans[index].outstanding = Number(e.target.value);
                            setNestedField(["liabilities", "longTerm", "goldLoans"], loans);
                          }}/>
                          <input type="number" placeholder="Pledged Gold (g)" value={loan.goldPledgedGrams || ""} style={{ flex: 1 }} onChange={e => {
                            const loans = [...portfolio.liabilities.longTerm.goldLoans];
                            loans[index].goldPledgedGrams = Number(e.target.value);
                            setNestedField(["liabilities", "longTerm", "goldLoans"], loans);
                          }}/>
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center" }}>
                          <input type="number" placeholder="Rate (%)" value={loan.interestRate} style={{ flex: 1 }} onChange={e => {
                            const loans = [...portfolio.liabilities.longTerm.goldLoans];
                            loans[index].interestRate = Number(e.target.value);
                            setNestedField(["liabilities", "longTerm", "goldLoans"], loans);
                          }}/>
                          <button className="delete-row-btn" onClick={() => {
                            const loans = portfolio.liabilities.longTerm.goldLoans.filter((l: any) => l.id !== loan.id);
                            setNestedField(["liabilities", "longTerm", "goldLoans"], loans);
                          }}><Trash2 size={12}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* CONTINGENT LIABILITIES & LEGAL/TAX RISKS */}
            <div className="ledger-section card" style={{ marginTop: 24 }}>
              <div className="card-body">
                <div className="card-head-title" style={{ marginBottom: 20 }}>Contingent Liabilities &amp; Tax Exposures</div>

                {/* Guarantor Obligations */}
                <div className="form-group-list">
                  <div className="card-head" style={{ marginBottom: 12 }}>
                    <div className="sec-title-inline">Guarantor Obligations (Guaranteed Loans for others)</div>
                    <button className="add-entry-btn" onClick={() => {
                      const conts = [...(portfolio.liabilities.contingent || [])];
                      conts.push({ id: Math.random().toString(), description: "Car Loan Guarantor", exposureAmount: 0, probabilityOfCalling: "low" });
                      setNestedField(["liabilities", "contingent"], conts);
                    }}><Plus size={12}/> Add Obligation</button>
                  </div>
                  
                  {portfolio.liabilities.contingent?.map((c: any, index: number) => (
                    <div key={c.id} className="inline-form-row">
                      <div className="form-col" style={{ flex: 1.5 }}>
                        <label>Obligation Description</label>
                        <input type="text" value={c.description} onChange={e => {
                          const conts = [...portfolio.liabilities.contingent];
                          conts[index].description = e.target.value;
                          setNestedField(["liabilities", "contingent"], conts);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Potential Exposure (₹)</label>
                        <input type="number" value={c.exposureAmount} onChange={e => {
                          const conts = [...portfolio.liabilities.contingent];
                          conts[index].exposureAmount = Number(e.target.value);
                          setNestedField(["liabilities", "contingent"], conts);
                        }}/>
                      </div>
                      <div className="form-col">
                        <label>Probability of being called</label>
                        <select value={c.probabilityOfCalling} onChange={e => {
                          const conts = [...portfolio.liabilities.contingent];
                          conts[index].probabilityOfCalling = e.target.value;
                          setNestedField(["liabilities", "contingent"], conts);
                        }}>
                          <option value="low">Low Probability</option>
                          <option value="medium">Medium</option>
                          <option value="high">High Risk</option>
                        </select>
                      </div>
                      <button className="delete-row-btn" onClick={() => {
                        const conts = portfolio.liabilities.contingent.filter((con: any) => con.id !== c.id);
                        setNestedField(["liabilities", "contingent"], conts);
                      }}><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>

                {/* Pending Tax Dues & Legal Disputes */}
                <div className="sec-title-inline" style={{ marginTop: 24, marginBottom: 12 }}>Unresolved Tax Dues &amp; Legal Disputes</div>
                <div className="nested-grid-row">
                  <div className="form-sub-card">
                    <div className="sub-card-title">Pending Tax Dues</div>
                    <div className="form-col">
                      <label>Estimated Unpaid Advance Tax / TDS Shortfall (₹)</label>
                      <input type="number" value={portfolio.liabilities.pendingTaxDues} onChange={e => setNestedField(["liabilities", "pendingTaxDues"], Number(e.target.value))}/>
                    </div>
                  </div>

                  <div className="form-sub-card" style={{ flex: 1.5 }}>
                    <div className="card-head" style={{ marginBottom: 10 }}>
                      <div className="sub-card-title">Legal Disputes financial exposure</div>
                      <button className="add-entry-btn" onClick={() => {
                        const legals = [...(portfolio.liabilities.legalDisputes || [])];
                        legals.push({ id: Math.random().toString(), description: "Property dispute", exposureAmount: 0 });
                        setNestedField(["liabilities", "legalDisputes"], legals);
                      }}><Plus size={10}/> Add Dispute</button>
                    </div>
                    {portfolio.liabilities.legalDisputes?.map((l: any, index: number) => (
                      <div key={l.id} className="inline-form-row" style={{ padding: 4, background: "none", border: "none" }}>
                        <input type="text" placeholder="Dispute Context" value={l.description} style={{ flex: 1.5 }} onChange={e => {
                          const legals = [...portfolio.liabilities.legalDisputes];
                          legals[index].description = e.target.value;
                          setNestedField(["liabilities", "legalDisputes"], legals);
                        }}/>
                        <input type="number" placeholder="Exposure (₹)" value={l.exposureAmount} style={{ flex: 1 }} onChange={e => {
                          const legals = [...portfolio.liabilities.legalDisputes];
                          legals[index].exposureAmount = Number(e.target.value);
                          setNestedField(["liabilities", "legalDisputes"], legals);
                        }}/>
                        <button className="delete-row-btn" onClick={() => {
                          const legals = portfolio.liabilities.legalDisputes.filter((leg: any) => leg.id !== l.id);
                          setNestedField(["liabilities", "legalDisputes"], legals);
                        }}><Trash2 size={12}/></button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ===================================================================
           TAB: PROTECTION LAYER
           =================================================================== */}
        {activeTab === "protection" && (
          <div className="ledger-tab-content">
            
            {/* Protection Summary Header */}
            <div className="protection-hero-card card">
              <div className="card-stripe" style={{ background: "linear-gradient(90deg, #7c3aed, #a855f7)" }}/>
              <div className="card-body">
                <div className="card-head-title" style={{ marginBottom: 10 }}>Your Security &amp; Protection Layer</div>
                <p className="card-sub-info">
                  Insurance is not just an asset or liability; it is your ultimate risk safeguard. Syntra separates Term Insurance (pure risk protection) from Endowment / LIC money-back policies (which hold cash surrender value) to evaluate your real net coverage metrics.
                </p>
              </div>
            </div>

            {/* Term Insurance (Pure Risk Protection) */}
            <div className="ledger-section card" style={{ marginTop: 24 }}>
              <div className="card-body">
                <div className="card-head">
                  <div className="card-head-title">Term Insurance Policies (Pure Cover)</div>
                  <button className="add-entry-btn" onClick={() => {
                    const terms = [...(portfolio.protection.termInsurance || [])];
                    terms.push({ id: Math.random().toString(), policyName: "HDFC Life Click 2 Protect", sumAssured: 10000000, annualPremium: 12000 });
                    setNestedField(["protection", "termInsurance"], terms);
                  }}><Plus size={12}/> Add Term Cover</button>
                </div>
                <p className="card-sub-info" style={{ marginBottom: 20 }}>Term insurance provides direct financial cover with zero investment surrender values.</p>

                {portfolio.protection.termInsurance?.map((policy: any, index: number) => (
                  <div key={policy.id} className="inline-form-row">
                    <div className="form-col" style={{ flex: 1.5 }}>
                      <label>Policy Name / Insurer</label>
                      <input type="text" value={policy.policyName} onChange={e => {
                        const terms = [...portfolio.protection.termInsurance];
                        terms[index].policyName = e.target.value;
                        setNestedField(["protection", "termInsurance"], terms);
                      }}/>
                    </div>
                    <div className="form-col">
                      <label>Sum Assured (Death Benefit) (₹)</label>
                      <input type="number" value={policy.sumAssured} onChange={e => {
                        const terms = [...portfolio.protection.termInsurance];
                        terms[index].sumAssured = Number(e.target.value);
                        setNestedField(["protection", "termInsurance"], terms);
                      }}/>
                    </div>
                    <div className="form-col">
                      <label>Annual Premium (₹)</label>
                      <input type="number" value={policy.annualPremium} onChange={e => {
                        const terms = [...portfolio.protection.termInsurance];
                        terms[index].annualPremium = Number(e.target.value);
                        setNestedField(["protection", "termInsurance"], terms);
                      }}/>
                    </div>
                    <button className="delete-row-btn" onClick={() => {
                      const terms = portfolio.protection.termInsurance.filter((p: any) => p.id !== policy.id);
                      setNestedField(["protection", "termInsurance"], terms);
                    }}><Trash2 size={13}/></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Endowment / LIC policies with Surrender values */}
            <div className="ledger-section card" style={{ marginTop: 24 }}>
              <div className="card-body">
                <div className="card-head">
                  <div className="card-head-title">Endowment / LIC Policies (With Surrender Value)</div>
                  <button className="add-entry-btn" onClick={() => {
                    const policies = [...(portfolio.protection.endowmentPolicies || [])];
                    policies.push({ id: Math.random().toString(), policyName: "LIC Jeevan Anand", sumAssured: 500000, surrenderValue: 80000, annualPremium: 22000 });
                    setNestedField(["protection", "endowmentPolicies"], policies);
                  }}><Plus size={12}/> Add Endowment Policy</button>
                </div>
                <p className="card-sub-info" style={{ marginBottom: 20 }}>These policies build surrender values over time, contributing to your net worth assets.</p>

                {portfolio.protection.endowmentPolicies?.map((policy: any, index: number) => (
                  <div key={policy.id} className="inline-form-row">
                    <div className="form-col" style={{ flex: 1.5 }}>
                      <label>Policy Name</label>
                      <input type="text" value={policy.policyName} onChange={e => {
                        const policies = [...portfolio.protection.endowmentPolicies];
                        policies[index].policyName = e.target.value;
                        setNestedField(["protection", "endowmentPolicies"], policies);
                      }}/>
                    </div>
                    <div className="form-col">
                      <label>Sum Assured (₹)</label>
                      <input type="number" value={policy.sumAssured} onChange={e => {
                        const policies = [...portfolio.protection.endowmentPolicies];
                        policies[index].sumAssured = Number(e.target.value);
                        setNestedField(["protection", "endowmentPolicies"], policies);
                      }}/>
                    </div>
                    <div className="form-col">
                      <label>Current Surrender Value (Asset) (₹)</label>
                      <input type="number" value={policy.surrenderValue} onChange={e => {
                        const policies = [...portfolio.protection.endowmentPolicies];
                        policies[index].surrenderValue = Number(e.target.value);
                        setNestedField(["protection", "endowmentPolicies"], policies);
                      }}/>
                    </div>
                    <div className="form-col">
                      <label>Annual Premium (₹)</label>
                      <input type="number" value={policy.annualPremium} onChange={e => {
                        const policies = [...portfolio.protection.endowmentPolicies];
                        policies[index].annualPremium = Number(e.target.value);
                        setNestedField(["protection", "endowmentPolicies"], policies);
                      }}/>
                    </div>
                    <button className="delete-row-btn" onClick={() => {
                      const policies = portfolio.protection.endowmentPolicies.filter((p: any) => p.id !== policy.id);
                      setNestedField(["protection", "endowmentPolicies"], policies);
                    }}><Trash2 size={13}/></button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&family=Inter:wght@300;400;500;600;700;800&display=swap');

  .networth-root {
    min-height: 100vh;
    background: #f4f6fb;
    font-family: "Inter", sans-serif;
    color: #0d1117;
    -webkit-font-smoothing: antialiased;
  }
  .networth-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px 80px;
  }

  /* ═══ NAV BAR ═══ */
  .back-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 0 0;
  }
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.82rem;
    font-weight: 600;
    color: #52637a;
    background: #ffffff;
    border: 1px solid #e4e9f4;
    border-radius: 9999px;
    padding: 8px 18px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }
  .back-btn:hover {
    color: #0055EE;
    border-color: #c7d7fa;
    background: #eef3ff;
    transform: translateX(-2px);
  }
  .back-bar-brand {
    font-family: "DM Sans", sans-serif;
    font-size: 0.78rem;
    font-weight: 800;
    color: #94a3b8;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
  .back-bar-brand span {
    color: #0055EE;
  }

  /* ═══ HEADING ═══ */
  .page-heading-block {
    padding: 40px 0 36px;
    border-bottom: 1px solid #e4e9f4;
    margin-bottom: 32px;
  }
  .page-eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }
  .eyebrow-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #0055EE;
    box-shadow: 0 0 0 2px rgba(0,85,238,0.18);
  }
  .eyebrow-text {
    font-size: 0.7rem;
    font-weight: 700;
    color: #0055EE;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .page-title {
    font-family: "DM Sans", sans-serif;
    font-size: clamp(2.2rem, 5vw, 3.4rem);
    font-weight: 900;
    color: #0055EE;
    letter-spacing: -0.04em;
    line-height: 1.15;
  }
  .page-subtitle {
    font-size: 0.9rem;
    color: #52637a;
    line-height: 1.7;
    margin-top: 10px;
    max-width: 700px;
  }

  /* ═══ SUMMARIES GRID ═══ */
  .summaries-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }
  .summary-card {
    background: #ffffff;
    border: 1px solid #e4e9f4;
    border-radius: 20px;
    padding: 20px 22px;
    box-shadow: 0 4px 14px rgba(0,68,220,0.04);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .net-worth-card {
    background: linear-gradient(135deg, #0055EE 0%, #1e40af 100%);
    border: none;
    color: #ffffff;
  }
  .sc-label {
    font-size: 0.73rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.8;
  }
  .net-worth-card .sc-label {
    color: rgba(255,255,255,0.85);
  }
  .sc-value {
    font-family: "DM Sans", sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }
  .sc-footer {
    font-size: 0.74rem;
    color: #52637a;
  }
  .net-worth-card .sc-footer {
    color: rgba(255,255,255,0.75);
  }
  .badge {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 9999px;
  }
  .badge.info { background: #eff6ff; color: #1e40af; }
  .badge.warn { background: #fffbeb; color: #b45309; }
  .badge.success { background: #ecfdf5; color: #047857; }
  .badge.danger { background: #fef2f2; color: #b91c1c; }

  /* ═══ TABS ═══ */
  .tabs-container {
    display: flex;
    gap: 8px;
    border-bottom: 1.5px solid #e4e9f4;
    padding-bottom: 1px;
    margin-bottom: 28px;
    align-items: center;
    flex-wrap: wrap;
  }
  .tab-btn {
    padding: 10px 20px;
    font-size: 0.76rem;
    font-weight: 700;
    color: #52637a;
    background: transparent;
    border: none;
    border-bottom: 3.5px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.05em;
  }
  .tab-btn:hover {
    color: #0055EE;
    border-bottom-color: #c7d7fa;
  }
  .tab-btn.active {
    color: #0055EE;
    border-bottom-color: #0055EE;
  }
  .save-btn-sticky {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: "DM Sans", sans-serif;
    font-size: 0.8rem;
    font-weight: 800;
    color: #ffffff;
    background: #0055EE;
    border: none;
    border-radius: 12px;
    padding: 10px 20px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0,85,238,0.25);
    transition: all 0.2s;
  }
  .save-btn-sticky:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(0,85,238,0.32);
    filter: brightness(1.05);
  }
  .save-btn-sticky:disabled {
    background: #94a3b8;
    box-shadow: none;
    cursor: not-allowed;
  }

  /* ═══ CARDS ═══ */
  .card {
    background: #ffffff;
    border: 1px solid #e4e9f4;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0,68,220,0.03);
    position: relative;
    overflow: hidden;
  }
  .card-stripe {
    height: 4px;
    width: 100%;
  }
  .card-body {
    padding: 24px;
  }
  .card-head-title {
    font-family: "DM Sans", sans-serif;
    font-size: 1.1rem;
    font-weight: 800;
    color: #0d1117;
  }
  .card-sub-info {
    font-size: 0.82rem;
    color: #52637a;
    line-height: 1.6;
  }

  /* ═══ OVERVIEW TAB ═══ */
  .overview-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  @media (max-width: 900px) {
    .overview-grid {
      grid-template-columns: 1fr;
    }
  }

  /* allocation */
  .allocation-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .allocation-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .row-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.84rem;
  }
  .row-info strong {
    color: #111;
  }
  .row-info span {
    font-weight: 700;
    color: #333;
  }
  .progress-track {
    height: 8px;
    background: #f1f5f9;
    border-radius: 9999px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    border-radius: 9999px;
    transition: width 0.8s ease-in-out;
  }
  .row-pct {
    font-size: 0.72rem;
    color: #7788aa;
    font-weight: 600;
  }

  /* net equity */
  .equity-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .empty-equity {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    padding: 30px;
    color: #7788aa;
    font-size: 0.82rem;
    border: 1px dashed #e4e9f4;
    border-radius: 14px;
  }
  .equity-item {
    border: 1px solid #f0f2f8;
    background: #fafbfe;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .eq-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.81rem;
  }
  .eq-name {
    font-weight: 700;
    color: #111;
  }
  .eq-val {
    color: #52637a;
    font-weight: 500;
  }
  .eq-meter-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .eq-meter-track {
    flex: 1;
    height: 6px;
    background: #e2e8f0;
    border-radius: 9999px;
    overflow: hidden;
  }
  .eq-meter-fill {
    height: 100%;
    border-radius: 9999px;
  }
  .eq-pct-text {
    font-size: 0.7rem;
    font-weight: 700;
    color: #52637a;
    white-space: nowrap;
  }
  .eq-footer-details {
    display: flex;
    justify-content: space-between;
    font-size: 0.76rem;
    border-top: 1px solid #f1f5f9;
    padding-top: 6px;
    color: #7788aa;
  }
  .eq-footer-details strong {
    color: #10b981;
    font-size: 0.8rem;
  }

  /* Risk summary */
  .risk-summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  .risk-metric-box {
    background: #fafbfe;
    border: 1px solid #e4e9f4;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .rm-lbl {
    font-size: 0.68rem;
    font-weight: 700;
    color: #7788aa;
    text-transform: uppercase;
  }
  .rm-val {
    font-family: "DM Sans", sans-serif;
    font-size: 1.15rem;
    font-weight: 800;
  }

  /* ═══ LEDGER TABS (FORMS) ═══ */
  .add-entry-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: "Inter", sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    color: #0055EE;
    background: #f0f4ff;
    border: 1px solid #c7d7fa;
    border-radius: 8px;
    padding: 5px 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .add-entry-btn:hover {
    background: #0055EE;
    color: #ffffff;
    border-color: #0055EE;
  }
  .sec-title-inline {
    font-family: "DM Sans", sans-serif;
    font-size: 0.95rem;
    font-weight: 800;
    color: #1a1f26;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 6px;
    margin-bottom: 14px;
  }
  .form-group-list {
    border: 1px solid #e4e9f4;
    background: #fafbfe;
    border-radius: 16px;
    padding: 18px;
  }
  .inline-form-row {
    display: flex;
    gap: 12px;
    align-items: flex-end;
    background: #ffffff;
    border: 1px solid #f0f2f8;
    border-radius: 12px;
    padding: 12px 14px;
    margin-bottom: 10px;
  }
  .form-col {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }
  .form-col label {
    font-size: 0.72rem;
    font-weight: 700;
    color: #7788aa;
  }
  .form-col input, .form-col select {
    height: 38px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0 10px;
    font-size: 0.81rem;
    color: #111;
    background: #ffffff;
    outline: none;
    transition: border-color 0.18s;
  }
  .form-col input:focus, .form-col select:focus {
    border-color: #0055EE;
  }
  .delete-row-btn {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: #fee2e2;
    border: 1px solid #fecaca;
    color: #ef4444;
    cursor: pointer;
    transition: all 0.2s;
  }
  .delete-row-btn:hover {
    background: #ef4444;
    color: #ffffff;
    border-color: #ef4444;
  }

  .nested-grid-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
  }
  .form-sub-card {
    background: #fafbfe;
    border: 1px solid #e4e9f4;
    border-radius: 16px;
    padding: 16px;
  }
  .sub-card-title {
    font-family: "DM Sans", sans-serif;
    font-size: 0.88rem;
    font-weight: 800;
    color: #111;
    margin-bottom: 10px;
  }

  /* message notice styles */
  .msg-box {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    border-radius: 12px;
    font-size: 0.84rem;
    font-weight: 600;
    margin-bottom: 24px;
  }
  .msg-box.success {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #047857;
  }
  .msg-box.error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
  }

  /* protection style */
  .protection-hero-card {
    background: #faf8ff;
    border-color: #e9e3ff;
  }

  @media (max-width: 768px) {
    .networth-page { padding: 0 16px 60px; }
    .inline-form-row {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }
    .delete-row-btn {
      width: 100%;
    }
    .tabs-container {
      flex-direction: column;
      align-items: stretch;
    }
    .save-btn-sticky {
      width: 100%;
      justify-content: center;
      margin-top: 10px;
    }
  }
`;

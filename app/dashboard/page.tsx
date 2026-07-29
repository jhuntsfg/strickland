"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { computeAgent, ComputedAgent } from "@/lib/computed";
import { AgentFull } from "@/lib/types";
import Sidebar from "@/components/Sidebar";
import MetricsRow from "@/components/MetricsRow";
import StallBanner from "@/components/StallBanner";
import FunnelGroups from "@/components/FunnelGroups";
import AddAgentModal from "@/components/AddAgentModal";

export type SortKey = "funnel" | "added" | "upline";

function sortAgents(agents: ComputedAgent[], sort: SortKey): ComputedAgent[] {
  const copy = [...agents];
  if (sort === "added") {
    return copy.sort((a, b) => a.agent.created_at.localeCompare(b.agent.created_at));
  }
  if (sort === "upline") {
    return copy.sort((a, b) => {
      const ua = a.agent.upline ?? "";
      const ub = b.agent.upline ?? "";
      return ua.localeCompare(ub) || a.agent.name.localeCompare(b.agent.name);
    });
  }
  // "funnel" — default, handled inside FunnelGroups
  return copy;
}

export default function DashboardPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<ComputedAgent[] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sort, setSort] = useState<SortKey>("funnel");
  const [showArchived, setShowArchived] = useState(false);

  async function load(archived = false) {
    const res = await fetch(`/api/admin/agents${archived ? "?include_archived=true" : ""}`);
    if (res.status === 401) {
      router.push("/");
      return;
    }
    const { agents } = await res.json();
    setAgents((agents as AgentFull[]).map((a) => computeAgent(a)));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(showArchived);

    const channel = supabase
      .channel("dashboard-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "agent_checks" }, () => load(showArchived))
      .on("postgres_changes", { event: "*", schema: "public", table: "agent_dates" }, () => load(showArchived))
      .on("postgres_changes", { event: "*", schema: "public", table: "agents" }, () => load(showArchived))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (!agents) {
    return <div className="p-8 text-gray-400">Loading…</div>;
  }

  const visible = showArchived ? agents.filter((a) => !!a.agent.archived_at) : agents;
  const sorted = sortAgents(visible, sort);

  return (
    <div className="flex min-h-screen">
      <Sidebar agents={agents} onAddAgent={() => setShowAddModal(true)} />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-end mb-6">
          <button onClick={handleSignOut} className="text-sm text-gray-500 hover:text-gray-800">
            Sign out
          </button>
        </div>
        <MetricsRow agents={agents} />
        <StallBanner agents={agents} />
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm text-gray-400">Sort by</span>
          {(["funnel", "added", "upline"] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                sort === key
                  ? "bg-primary text-white border-primary"
                  : "border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
              }`}
            >
              {key === "funnel" ? "Funnel stage" : key === "added" ? "Date added" : "Upline"}
            </button>
          ))}
          <div className="ml-auto">
            <button
              onClick={() => { const next = !showArchived; setShowArchived(next); load(next); }}
              className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                showArchived
                  ? "bg-gray-200 text-gray-700 border-gray-300"
                  : "border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300"
              }`}
            >
              {showArchived ? "Hide archived" : "Show archived"}
            </button>
          </div>
        </div>
        {showArchived && (
          <div className="mb-4 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500">
            Showing archived agents. These agents are hidden from the normal pipeline.
          </div>
        )}
        <FunnelGroups agents={sorted} sort={sort} />
      </main>
      {showAddModal && (
        <AddAgentModal
          onClose={() => setShowAddModal(false)}
          onCreated={(agentId) => router.push(`/dashboard/${agentId}`)}
        />
      )}
    </div>
  );
}

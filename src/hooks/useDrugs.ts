import { useState, useEffect } from "react";

export const useDrugs = (supabase) => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrugs = async () => {
      const { data, error } = await supabase
        .from("drugs")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setDrugs(data);
        localStorage.setItem("pharmaops_drugs", JSON.stringify(data));
      } else {
        const cached = localStorage.getItem("pharmaops_drugs");
        if (cached) setDrugs(JSON.parse(cached));
      }
      setLoading(false);
    };
    fetchDrugs();
  }, [supabase]);

  return { drugs, setDrugs, loading };
};

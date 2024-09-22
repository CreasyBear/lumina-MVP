from pyvis.network import Network
import networkx as nx

class InteractiveGraph:
    def __init__(self):
        self.graph = nx.DiGraph()
        self.vis_network = Network(height="750px", width="100%", bgcolor="#222222", font_color="white")

    def add_node(self, node_id, label, **kwargs):
        self.graph.add_node(node_id, label=label, **kwargs)

    def add_edge(self, from_node, to_node, **kwargs):
        self.graph.add_edge(from_node, to_node, **kwargs)

    def highlight_critical_path(self, critical_path):
        for i in range(len(critical_path) - 1):
            self.graph[critical_path[i]][critical_path[i+1]]['color'] = 'red'
            self.graph[critical_path[i]][critical_path[i+1]]['width'] = 3

    def generate_html(self):
        self.vis_network.from_nx(self.graph)
        return self.vis_network.generate_html()

    def calculate_centrality(self):
        return nx.betweenness_centrality(self.graph)

    def community_detection(self):
        return list(nx.community.greedy_modularity_communities(self.graph.to_undirected()))
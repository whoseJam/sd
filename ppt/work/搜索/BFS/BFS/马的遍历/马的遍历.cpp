#include<bits/stdc++.h>
using namespace std;
struct node{
	int x,y;
};
int n,m,X,Y;
int vis[410][410];
int dis[410][410];
int dx[8]={1,1,-1,-1,2,2,-2,-2};
int dy[8]={2,-2,2,-2,1,-1,1,-1};
queue<node>q;
void Bfs(){
	q.push((node){X,Y});
	vis[X][Y]=1;
	while(!q.empty()){
		node u=q.front();q.pop();
		for(int i=0;i<8;i++){
			int nx=u.x+dx[i];
			int ny=u.y+dy[i];
			if(1<=nx&&nx<=n&&1<=ny&&ny<=m&&!vis[nx][ny]){
				vis[nx][ny]=1;
				dis[nx][ny]=dis[u.x][u.y]+1;
				q.push((node){nx,ny});
			}
		}
	}
}
int main(){
	cin>>n>>m;
	cin>>X>>Y;
	Bfs();
	for(int i=1;i<=n;i++){
		for(int j=1;j<=m;j++){
			if(vis[i][j]==0&&(i!=X||j!=Y)){
				cout<<-1<<' ';
			}else{
				cout<<dis[i][j]<<' ';
			}
		}
		cout<<endl;
	}
	return 0;
}
